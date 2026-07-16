import threading
import pytest
from django.contrib.auth import get_user_model
from providers.models import ProviderProfile, Service, Availability
from bookings.models import Booking
from bookings.services import create_booking
from django.core.exceptions import ValidationError
from django.utils import timezone
from datetime import timedelta
from django.test import TransactionTestCase

User = get_user_model()


class BookingConcurrencyTest(TransactionTestCase):
    """
    Uses TransactionTestCase (not the usual TestCase) because regular
    TestCase wraps each test in a transaction that's rolled back at the
    end — which would hide real locking behavior. TransactionTestCase
    actually commits to the DB, so select_for_update() behaves like it
    would in production.
    """

    def setUp(self):
        provider_user = User.objects.create_user(
            username="provider1", password="pass12345", role=User.Role.PROVIDER
        )
        self.provider_profile = ProviderProfile.objects.create(
            user=provider_user,
            business_name="Test Coaching",
            location="Warsaw",
            category="fitness",
        )
        self.service = Service.objects.create(
            provider=self.provider_profile,
            title="1:1 Session",
            duration_minutes=60,
            price=100,
        )
        self.availability = Availability.objects.create(
            provider=self.provider_profile,
            service=self.service,
            start_time=timezone.now() + timedelta(days=1),
            end_time=timezone.now() + timedelta(days=1, hours=1),
        )
        self.client_a = User.objects.create_user(
            username="clienta", password="pass12345", role=User.Role.CLIENT
        )
        self.client_b = User.objects.create_user(
            username="clientb", password="pass12345", role=User.Role.CLIENT
        )

    def test_two_simultaneous_bookings_only_one_succeeds(self):
        results = {"success": 0, "failure": 0}
        lock = threading.Lock()

        def attempt_booking(client):
            try:
                create_booking(client, self.availability.id)
                with lock:
                    results["success"] += 1
            except ValidationError:
                with lock:
                    results["failure"] += 1

        thread_a = threading.Thread(target=attempt_booking, args=(self.client_a,))
        thread_b = threading.Thread(target=attempt_booking, args=(self.client_b,))

        thread_a.start()
        thread_b.start()
        thread_a.join()
        thread_b.join()

        # Exactly one booking should succeed, the other should be rejected
        self.assertEqual(results["success"], 1)
        self.assertEqual(results["failure"], 1)
        self.assertEqual(Booking.objects.filter(availability=self.availability).count(), 1)