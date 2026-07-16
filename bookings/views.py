from rest_framework import views, permissions, status as http_status
from rest_framework.response import Response
from django.core.exceptions import ValidationError

from providers.models import Availability
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

        return Response(booking, status=http_status.HTTP_201_CREATED)