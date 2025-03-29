from rest_framework import generics, permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth.models import User
from django.conf import settings
import json
import openai

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
openai.api_key = settings.OPENAI_API_KEY

class SmartSearchEventView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user_query = request.data.get('query')
        if not user_query:
            return Response({'error': 'Query parameter is required.'},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            # Converting the natural-language query into a Django ORM filter dictionary.
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": self.get_system_prompt()},
                    {"role": "user", "content": user_query}
                ],
                temperature=0.0  
            )

            generated_filter_str = response.choices[0].message.content.strip()

            # Parsing the generated filter(json).
            try:
                filter_dict = json.loads(generated_filter_str)
            except json.JSONDecodeError:
                return Response(
                    {
                        'error': 'Failed to parse the generated filter.',
                        'generated': generated_filter_str
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Appling the filter.
            events = Event.objects.filter(**filter_dict)
            serializer = EventSerializer(events, many=True, context={'request': request})

            # Return the response
            return Response({
                'user_query': user_query,
                'generated_filter': filter_dict,
                'results': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# approximate prompt example
    def get_system_prompt(self):
        return  (
        "You are a helpful assistant that converts a natural-language query into a Django ORM filter dictionary for filtering Event records. "
        "The Event model has fields such as id, title, description, city_id, pos_votes, neg_votes, created_by, created_at, etc. "
        "Events are associated with cities. Use the following city mapping to determine the correct 'city_id': "
        "Astana: 1, Almaty: 2, Aktau: 3, Aktobe: 4, Shymkent: 5, Karaganda: 6, Pavlodar: 7, Ust-Kamenogorsk: 8, Semey: 9, Taraz: 10. "
        "Return only the filter dictionary as a valid JSON object without any extra text. "
        "For example, if the query is 'Show events in Shymkent with more than 10 positive votes', return: "
        '{"city_id": 5, "pos_votes__gt": 10}'
    )

