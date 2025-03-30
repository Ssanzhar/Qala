from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User
from django.conf import settings
import json
from openai import OpenAI

from .models import Event, Vote
from .serializers import EventSerializer, VoteSerializer, UserSerializer



class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class EventDetailView(generics.RetrieveDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        if event.created_by != request.user:
            raise PermissionDenied('You do not have permission to delete this event.')
        return super().destroy(request, *args, **kwargs)


class VoteCreateOrUpdateView(generics.CreateAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        event = serializer.validated_data['event']
        vote_type = serializer.validated_data['vote_type']

        existing_vote = Vote.objects.filter(user=user, event=event).first()

        if existing_vote:
            existing_vote.vote_type = vote_type
            existing_vote.save()
            event.update_votes()
            self.updated = True
        else:
            serializer.save(user=user)
            event.update_votes()
            self.updated = False

    def create(self, request, *args, **kwargs):
        self.updated = False
        response = super().create(request, *args, **kwargs)

        if self.updated:
            return Response({'message': 'Your vote has been updated.'}, status=status.HTTP_200_OK)
        return Response({'message': 'Your vote has been created.'}, status=status.HTTP_201_CREATED)


class SignupView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response({'error': 'Username and password are required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'User created successfully.'}, status=status.HTTP_201_CREATED)


class UserEventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(created_by=self.request.user)


class EventListFilterByCityView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        city_id = self.request.query_params.get('city_id')
        queryset = Event.objects.filter(city_id=city_id) if city_id else Event.objects.all()
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class EventListSortedByVotesView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        city_id = self.request.query_params.get('city_id')
        if not city_id:
            raise serializers.ValidationError('city_id is required')
        return Event.objects.filter(city_id=city_id).order_by('-pos_votes')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['user'] = self.request.user
        return context


class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)


# Smart Search Implementation
client = OpenAI(api_key=settings.OPENAI_API_KEY)
class SmartSearchEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_query = request.data.get('query')
        if not user_query:
            return Response({"error": "Query parameter is required."},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            first_response = client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "system", "content": self.get_system_prompt()},
                         {"role": "user", "content": user_query}],
                response_format={"type": "json_object"},
            )
            generated_response_str = first_response.choices[0].message.content.strip()
            
            try:
                search_config = json.loads(generated_response_str)
                filter_dict = search_config.get("filters", {})
                sort_instructions = search_config.get("sort_by", [])
                keywords = search_config.get("keywords", [])
                synonyms = search_config.get("synonyms", [])

            except json.JSONDecodeError:
                corrected_response = client.chat.completions.create(
                    model="gpt-4o",
                    messages = [{"role": "system", "content": "Fix this malformed JSON to be a valid search configuration with 'filters', 'sort_by', 'keywords', and 'synonyms' fields:"}
                                , {"role": "user", "content": generated_response_str}],
                    response_format = {"type": "json_object"}
                )
                corrected_config_str = corrected_response.choices[0].message.content.strip()
                try:
                    search_config = json.loads(corrected_config_str)
                    filter_dict = search_config.get("filters", {})
                    sort_instructions = search_config.get("sort_by", [])
                    keywords = search_config.get("keywords", [])
                    synonyms = search_config.get("synonyms", [])
                except json.JSONDecodeError:
                    return Response({
                        "error": "Failed to parse search configuration.",
                        "generated": generated_response_str,
                        "attempted_correction": corrected_config_str
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            events = []
            
            sanitized_filter = self.sanitize_filter(filter_dict, user_query)
            
            if "error" in sanitized_filter and sanitized_filter["error"] != "No valid filter parameters found":
                return Response({
                    "error": sanitized_filter["error"]
                }, status=status.HTTP_400_BAD_REQUEST)
            
            if sanitized_filter and "error" not in sanitized_filter:
                primary_events = Event.objects.filter(**sanitized_filter)
                
                if sort_instructions:
                    primary_events = primary_events.order_by(*sort_instructions)
                
                events.extend(list(primary_events))
            
            from django.db.models import Q
            
            fallback_query = Q()
            search_terms = keywords + synonyms + [user_query]
            
            search_terms = list(set(filter(None, search_terms)))
            
            for term in search_terms:
                fallback_query |= Q(name__icontains=term) | Q(description__icontains=term)
            
            if 'city_id' in filter_dict:
                fallback_query &= Q(city_id=sanitized_filter.get('city_id', filter_dict['city_id']))
            
            fallback_events = Event.objects.filter(fallback_query)
            
            combined_events = list(events)
            for event in fallback_events:
                if event not in combined_events:
                    combined_events.append(event)
            
            if sort_instructions and combined_events:
                if combined_events and not isinstance(combined_events[0], dict):
                    event_ids = [event.id for event in combined_events]
                    combined_events = Event.objects.filter(id__in=event_ids).order_by(*sort_instructions)
            
            serialized_events = EventSerializer(combined_events, many=True, context={"request": request}).data
            
            all_terms = keywords + synonyms
            if all_terms:
                scored_events = self.score_events_by_relevance(serialized_events, all_terms, user_query)
                sorted_events = sorted(scored_events, key=lambda x: x['relevance_score'], reverse=True)
            else:
                sorted_events = [{'event': event, 'relevance_score': 0} for event in serialized_events]
            
            result_events = [item['event'] for item in sorted_events]
            
            return Response({
                "user_query": user_query,
                "filter_applied": sanitized_filter if "error" not in sanitized_filter else {},
                "sort_applied": sort_instructions,
                "keywords": keywords,
                "synonyms": synonyms,
                "results": result_events,
                "result_count": len(result_events)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def score_events_by_relevance(self, events, keywords, original_query):
        scored_events = []
        
        search_terms = keywords + [term.strip() for term in original_query.lower().split()]
        search_terms = list(set(search_terms))
        
        for event in events:
            score = 0
            event_text = f"{event.get('name', '')} {event.get('description', '')}"
            event_text = event_text.lower()
            
            for keyword in search_terms:
                keyword = keyword.lower()
                if keyword in event_text:
                    occurrences = event_text.count(keyword)
                    score += occurrences * 2
                
                event_words = set(event_text.split())
                for word in event_words:
                    if keyword in word or word in keyword:
                        similarity_ratio = min(len(keyword), len(word)) / max(len(keyword), len(word))
                        score += similarity_ratio
                
                if keyword in event.get('name', '').lower():
                    score += 5
            
            pos_votes = event.get('pos_votes', 0)
            score += min(pos_votes / 10, 3)
            
            if 'date' in event:
                try:
                    from datetime import datetime
                    created_date = datetime.fromisoformat(event['date'].replace('Z', '+00:00'))
                    days_old = (datetime.now() - created_date).days
                    recency_boost = max(0, 2 - (days_old / 30))
                    score += recency_boost
                except (ValueError, TypeError):
                    pass
            
            if original_query.lower() in event_text:
                score += 10
            
            scored_events.append({
                'event': event,
                'relevance_score': score
            })
        
        return scored_events
    
    def sanitize_filter(self, filter_dict, user_query):
        allowed_fields = {
            'id', 'name', 'description', 'city_id', 'pos_votes', 'neg_votes', 
            'date', 'created_by', 'created_by_id'
        }
        allowed_lookups = {'__exact', '__contains', '__icontains', '__gt', '__gte', '__lt', '__lte', 
                          '__startswith', '__istartswith', '__endswith', '__iendswith'}
        
        harmful_terms = ['delete', 'drop', 'remove', 'destroy', 'alter', 'update', 'modify']
        if any(term in user_query.lower() for term in harmful_terms):
            return {"error": "Potentially harmful operation detected in query"}
        
        sanitized_filter = {}
        for key, value in filter_dict.items():
            base_field = key.split('__')[0]
            
            if base_field not in allowed_fields:
                continue
            
            is_allowed = True
            for part in key.split('__')[1:]:
                if f"__{part}" not in allowed_lookups:
                    is_allowed = False
                    break
            
            if is_allowed:
                sanitized_filter[key] = value
        
        if 'city_id' in filter_dict and isinstance(filter_dict['city_id'], str):
            city_mapping = {
                'astana': 1, 'almaty': 2, 'aktau': 3, 'aktobe': 4, 'shymkent': 5,
                'karaganda': 6, 'pavlodar': 7, 'ust-kamenogorsk': 8, 'semey': 9, 'taraz': 10
            }
            city_name = filter_dict['city_id'].lower()
            if city_name in city_mapping:
                sanitized_filter['city_id'] = city_mapping[city_name]
        
        return sanitized_filter if sanitized_filter else {"error": "No valid filter parameters found"}
            
    def get_system_prompt(self):
        return (
            "You are a specialized assistant that converts natural language queries into search configurations for the Event model. "
            "Your task is to analyze the user's query and return a JSON object containing four components: "
            "1. 'filters': Django ORM filter dictionary for initial filtering "
            "2. 'sort_by': List of fields to sort by (with - prefix for descending) "
            "3. 'keywords': List of important keywords for relevance scoring "
            "4. 'synonyms': List of synonyms and related words for the keywords to broaden the search"
            "\n\nEvent model fields:"
            "\n- id: Integer (primary key)"
            "\n- name: String (event name)"
            "\n- description: Text (event description)"
            "\n- city_id: Integer (foreign key to City model)"
            "\n- pos_votes: Integer (positive votes count)"
            "\n- neg_votes: Integer (negative votes count)"
            "\n- created_by: ForeignKey to User model"
            "\n- date: DateTime"
            "\n\nCity ID mapping:"
            "\n- Astana: 1, Almaty: 2, Aktau: 3, Aktobe: 4, Shymkent: 5"
            "\n- Karaganda: 6, Pavlodar: 7, Ust-Kamenogorsk: 8, Semey: 9, Taraz: 10"
            "\n\nCommon filter operations:"
            "\n- Exact match: field=value"
            "\n- Greater than: field__gt=value"
            "\n- Less than: field__lt=value"
            "\n- Contains (case-sensitive): field__contains=value"
            "\n- Contains (case-insensitive): field__icontains=value"
            "\n\nSort fields for 'sort_by':"
            "\n- 'date' (newest first: '-date')"
            "\n- 'pos_votes' (most votes first: '-pos_votes')"
            "\n- 'neg_votes' (least negative votes first: 'neg_votes')"
            "\n\nImportant: For better recall, use fewer restrictive filters and provide more keywords and synonyms. "
            "The search system will use a fallback mechanism to find relevant results even when exact matches aren't found. "
            "Think broadly about related terms - for example, 'trash' should include synonyms like 'garbage', 'waste', 'litter', etc."
            "\n\nReturn ONLY the JSON without any explanation or additional text."
            "\n\nExamples:"
            "\nQuery: 'Events in Almaty with more than 5 positive votes'"
            "\nOutput: {\"filters\": {\"city_id\": 2, \"pos_votes__gt\": 5}, \"sort_by\": [\"-pos_votes\"], \"keywords\": [\"popular\", \"voted\"], \"synonyms\": []}"
            "\n\nQuery: 'Find the most popular events related to music in Astana'"
            "\nOutput: {\"filters\": {\"city_id\": 1}, \"sort_by\": [\"-pos_votes\"], \"keywords\": [\"music\", \"concert\"], \"synonyms\": [\"band\", \"performance\", \"song\", \"singer\", \"musician\", \"show\", \"festival\"]}"
            "\n\nQuery: 'The most relevant problems related to air pollution'"
            "\nOutput: {\"filters\": {}, \"sort_by\": [\"-pos_votes\"], \"keywords\": [\"air pollution\", \"pollution\"], \"synonyms\": [\"air quality\", \"environment\", \"smog\", \"emissions\", \"fumes\", \"contaminants\", \"health\"]}"
            "\n\nQuery: 'trash'"
            "\nOutput: {\"filters\": {}, \"sort_by\": [\"-pos_votes\"], \"keywords\": [\"trash\"], \"synonyms\": [\"garbage\", \"waste\", \"litter\", \"rubbish\", \"junk\", \"debris\", \"refuse\", \"trashes\"]}"
        )


