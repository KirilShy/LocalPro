from rest_framework import generics

from .models import ProviderProfile, Availability
from .serializers import ProviderProfileSerializer, AvailabilitySerializer


class ProviderProfileListView(generics.ListAPIView):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer


class ProviderProfileDetailView(generics.RetrieveAPIView):
    queryset = ProviderProfile.objects.all()
    serializer_class = ProviderProfileSerializer


class AvailabilityListView(generics.ListAPIView):
    serializer_class = AvailabilitySerializer

    def get_queryset(self):
        queryset = Availability.objects.filter(is_booked=False)
        service_id = self.request.query_params.get('service')
        if service_id:
            queryset = queryset.filter(service_id=service_id)
        return queryset
