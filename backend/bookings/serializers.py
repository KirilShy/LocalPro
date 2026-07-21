from rest_framework import serializers
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    provider_name = serializers.CharField(
        source='availability.provider.business_name', read_only=True
    )
    service_title = serializers.CharField(
        source='availability.service.title', read_only=True
    )
    start_time = serializers.DateTimeField(
        source='availability.start_time', read_only=True
    )
    end_time = serializers.DateTimeField(
        source='availability.end_time', read_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 'availability', 'status', 'created_at',
            'provider_name', 'service_title', 'start_time', 'end_time',
        ]
        read_only_fields = ['status', 'created_at']
