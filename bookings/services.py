from django.db import transaction
from django.core.exceptions import ValidationError
from providers.models import Availability
from .models import Booking

def create_booking(client, availability_id):
    with transaction.atomic():
        slot = Availability.objects.select_for_update().get(id=availability_id)

        if slot.is_booked:
            raise ValidationError("Slot is already booked")

        slot.is_booked = True
        slot.save()

        booking = Booking.objects.create(
            client=client,
            availability=slot
        )
        return booking