from django.contrib import admin
from .models import Event, City, Vote

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'date', 'description', 'latitude', 'longitude', 'pos_votes', 'neg_votes', 'image']
    search_fields = ['name', 'city__name']
    list_filter = ['city', 'date']
@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'vote_type']
    list_filter = ['vote_type']
    search_fields = ['user__username', 'event__name']
@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
