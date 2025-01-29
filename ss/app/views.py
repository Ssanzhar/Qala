
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Event, Vote
from .serializers import EventSerializer, VoteSerializer, UserSerializer
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.exceptions import PermissionDenied


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
            return Response(
                {'message': 'Your vote has been updated.'}, 
                status=status.HTTP_200_OK
            )
        return Response(
            {'message': 'Your vote has been created.'}, 
            status=status.HTTP_201_CREATED
        )



class SignupView(APIView):
    permission_classes = []  

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(username=username, email=email, password=password)
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
