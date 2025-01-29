from rest_framework import serializers
from .models import City, Event, Vote
from django.contrib.auth.models import User


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['id', 'name']

class EventSerializer(serializers.ModelSerializer):
    user_vote = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'name', 'description', 'city', 'date', 'latitude', 'longitude', 'pos_votes', 'neg_votes', 'image', 'user_vote']
        extra_kwargs = {
            'user_vote': {'read_only': True}
        }

    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            vote = Vote.objects.filter(user=request.user, event=obj).first()
            return vote.vote_type if vote else None
        return None


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'event', 'vote_type']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        