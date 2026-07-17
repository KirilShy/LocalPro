from rest_framework import generics

from .models import ProviderProfile
from .serializers import ProviderProfileSerializer


class ProviderProfileListView(generics.ListAPIView):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer
