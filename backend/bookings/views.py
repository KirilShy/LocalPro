from rest_framework import views, generics, permissions, status as http_status
from rest_framework.response import Response
from django.core.exceptions import ValidationError

from providers.models import Availability
from .models import Booking
from .serializers import BookingSerializer
from .services import create_booking


class CreateBookingView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        availability_id = request.data.get('availability_id')
        try:
            booking = create_booking(request.user, availability_id)
        except ValidationError as e:
            return Response(e.message, status=http_status.HTTP_400_BAD_REQUEST)
        except Availability.DoesNotExist:
            return Response("Availability not found", status=http_status.HTTP_404_NOT_FOUND)

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=http_status.HTTP_201_CREATED)


class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(
            client=self.request.user
        ).select_related('availability__provider', 'availability__service').order_by('-created_at')