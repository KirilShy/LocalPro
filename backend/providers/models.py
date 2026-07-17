from django.db import models
from django.conf import settings

class Availability(models.Model):
    provider = models.ForeignKey(
        'ProviderProfile',
        on_delete=models.CASCADE,
        related_name='availability_slots',
    )
    service = models.ForeignKey(
        'Service',
        on_delete=models.CASCADE,
        related_name='availability_slots',
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    is_booked = models.BooleanField(default=False)

    class Meta:
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['service', 'start_time', "is_booked"]),
        ]

    def __str__(self):
        return f"{self.provider} - {self.start_time} ({'booked' if self.is_booked else 'available'})"

class ProviderProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='provider_profile'
    )
    business_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    avg_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.business_name


class Service(models.Model):
    provider = models.ForeignKey(
        ProviderProfile,
        on_delete=models.CASCADE,
        related_name='services'
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    duration_minutes = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} - {self.provider.business_name}"

