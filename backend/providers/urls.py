from django.urls import path
from .views import ProviderProfileListView

urlpatterns = [
    path('profiles/', ProviderProfileListView.as_view(), name='provider_profile_list'),
]
