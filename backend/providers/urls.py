from django.urls import path
from .views import ProviderProfileListView, ProviderProfileDetailView, AvailabilityListView

urlpatterns = [
    path('profiles/', ProviderProfileListView.as_view(), name='provider_profile_list'),
    path('profiles/<int:pk>/', ProviderProfileDetailView.as_view(), name='provider_profile_detail'),
    path('availability/', AvailabilityListView.as_view(), name='availability_list'),
]
