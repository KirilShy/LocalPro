import { useEffect, useState } from "react";
import apiClient from "../api/client";

interface Provider {
  id: number;
  business_name: string;
  category: string;
  location: string;
}

export default function ProviderList() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get("/providers/profiles/")
      .then((res) => setProviders(res.data))
      .catch(() => setError("Could not reach the backend."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {providers.map((p) => (
        <li key={p.id}>
          <strong>{p.business_name}</strong> — {p.category} ({p.location})
        </li>
      ))}
    </ul>
  );
}