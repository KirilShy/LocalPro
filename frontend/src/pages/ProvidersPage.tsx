import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProviders, type ProviderProfile } from "../api/providers";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProviders()
      .then(setProviders)
      .catch(() => setError("Could not reach the backend."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>Find a provider</h1>
        <p>Browse coaches, tutors, and technicians near you.</p>
      </div>

      {loading && <p className="empty-state">Loading providers…</p>}
      {error && <p className="alert alert-error">{error}</p>}
      {!loading && !error && providers.length === 0 && (
        <p className="empty-state">No providers listed yet.</p>
      )}

      <div className="card-grid">
        {providers.map((p) => (
          <Link key={p.id} to={`/providers/${p.id}`} className="card provider-card">
            <span className="badge">{p.category}</span>
            <h3>{p.business_name}</h3>
            <span className="location">{p.location}</span>
            <p className="bio">{p.bio}</p>
            <span className="rating">★ {Number(p.avg_rating).toFixed(1)}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
