from rest_framework import serializers
from .models import ProviderProfile, Service, Availability


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = [
            'id', 'provider', 'service', 'start_time', 'end_time', 'is_booked',
        ]
        read_only_fields = ['is_booked']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id', 'provider', 'title', 'description', 'duration_minutes', 'price', 'is_active'
        ]
        read_only_fields = ['provider']


class ProviderProfileSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ProviderProfile
        fields = [
            'id', 'user', 'business_name', 'bio', 'location', 'category', 'avg_rating', 'services', 'created_at'
        ]
        read_only_fields = ['user', 'created_at', 'avg_rating']