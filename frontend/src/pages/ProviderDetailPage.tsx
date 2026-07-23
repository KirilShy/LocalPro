import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProvider, getAvailability, type ProviderProfile, type Service, type Availability } from "../api/providers";
import { createBooking } from "../api/bookings";
import { useAuth } from "../context/AuthContext";

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [slots, setSlots] = useState<Availability[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Availability | null>(null);

  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProvider(id)
      .then(setProvider)
      .catch(() => setError("Could not load this provider."))
      .finally(() => setLoading(false));
  }, [id]);

  const selectService = (service: Service) => {
    setSelectedService(service);
    setSelectedSlot(null);
    setBookingSuccess(false);
    setSlotsLoading(true);
    getAvailability(service.id)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setBooking(true);
    setBookingError(null);
    try {
      await createBooking(selectedSlot.id);
      setBookingSuccess(true);
      setSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
      setSelectedSlot(null);
    } catch {
      setBookingError("That slot is no longer available. Pick another.");
    } finally {
      setBooking(false);
    }
  };

  const formatSlot = (slot: Availability) =>
    new Date(slot.start_time).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  if (loading) return <p className="empty-state">Loading…</p>;
  if (error || !provider) return <p className="alert alert-error">{error ?? "Provider not found."}</p>;

  return (
    <>
      <div className="provider-header">
        <div>
          <span className="badge">{provider.category}</span>
          <h1 style={{ margin: "0.4rem 0 0.2rem" }}>{provider.business_name}</h1>
          <span className="location">{provider.location}</span>
        </div>
        <span className="rating">★ {Number(provider.avg_rating).toFixed(1)}</span>
      </div>

      {provider.bio && <p>{provider.bio}</p>}

      <h2 style={{ fontSize: "1.1rem" }}>Services</h2>
      <div className="service-list">
        {provider.services.map((service) => (
          <div
            key={service.id}
            className={`card service-row ${selectedService?.id === service.id ? "selected" : ""}`}
            onClick={() => selectService(service)}
          >
            <div>
              <h4>{service.title}</h4>
              <p>{service.description || `${service.duration_minutes} minutes`}</p>
            </div>
            <span className="service-price">${service.price}</span>
          </div>
        ))}
      </div>

      {selectedService && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "1.1rem" }}>Open slots for {selectedService.title}</h2>

          {slotsLoading && <p className="empty-state">Loading slots…</p>}
          {!slotsLoading && slots.length === 0 && (
            <p className="empty-state">No open slots for this service right now.</p>
          )}

          <div className="slot-grid">
            {slots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                className={`slot-btn ${selectedSlot?.id === slot.id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedSlot(slot);
                  setBookingError(null);
                  setBookingSuccess(false);
                }}
              >
                {formatSlot(slot)}
              </button>
            ))}
          </div>

          {bookingSuccess && (
            <p className="alert alert-success" style={{ marginTop: "1.25rem" }}>
              Booked! Check "My bookings" for details.
            </p>
          )}

          {selectedSlot && (
            <div style={{ marginTop: "1.25rem" }}>
              {bookingError && <p className="alert alert-error">{bookingError}</p>}
              <button type="button" className="btn btn-primary" onClick={handleBook} disabled={booking}>
                {booking
                  ? "Booking…"
                  : isLoggedIn
                    ? `Book ${formatSlot(selectedSlot)}`
                    : "Log in to book"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
