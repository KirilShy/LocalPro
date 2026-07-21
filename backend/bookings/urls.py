from django.urls import path
from .views import CreateBookingView, MyBookingsView

urlpatterns = [
    path("create/", CreateBookingView.as_view(), name="create_booking"),
    path("mine/", MyBookingsView.as_view(), name="my_bookings"),
]