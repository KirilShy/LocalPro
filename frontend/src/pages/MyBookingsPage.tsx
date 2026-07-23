import { useEffect, useState } from "react";
import { getMyBookings, type Booking } from "../api/bookings";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyBookings()
      .then(setBookings)
      .catch(() => setError("Could not load your bookings."))
      .finally(() => setLoading(false));
  }, []);

  const formatRange = (b: Booking) => {
    const start = new Date(b.start_time);
    const end = new Date(b.end_time);
    const date = start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    return `${date}, ${startTime} – ${endTime}`;
  };

  return (
    <>
      <div className="page-header">
        <h1>My bookings</h1>
        <p>Everything you've booked, most recent first.</p>
      </div>

      {loading && <p className="empty-state">Loading…</p>}
      {error && <p className="alert alert-error">{error}</p>}
      {!loading && !error && bookings.length === 0 && (
        <p className="empty-state">No bookings yet — go find a provider.</p>
      )}

      {bookings.map((b) => (
        <div key={b.id} className="card booking-row">
          <div>
            <h4>{b.service_title}</h4>
            <p>
              {b.provider_name} · {formatRange(b)}
            </p>
          </div>
          <span className={`status-pill status-${b.status}`}>{b.status}</span>
        </div>
      ))}
    </>
  );
}
