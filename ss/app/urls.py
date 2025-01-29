from django.urls import path
from .views import EventListCreateView, EventDetailView, VoteCreateOrUpdateView, SignupView, UserEventListView, EventListFilterByCityView, EventListSortedByVotesView, UserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('votes/', VoteCreateOrUpdateView.as_view(), name='vote-create'),
    path('signup/', SignupView.as_view(), name='signup'),
    path('token/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('user-events/', UserEventListView.as_view(), name='user-event-list'),
    path('filter-by-city/', EventListFilterByCityView.as_view(), name='event-filter-city'),
    path('sorted-by-votes/', EventListSortedByVotesView.as_view(), name='event-sorted-votes'),
    path('user/', UserView.as_view(), name='user'),

]