import apiClient from "./client";

export interface Service {
  id: number;
  provider: number;
  title: string;
  description: string;
  duration_minutes: number;
  price: string;
  is_active: boolean;
}

export interface ProviderProfile {
  id: number;
  user: number;
  business_name: string;
  bio: string;
  location: string;
  category: string;
  avg_rating: string;
  services: Service[];
  created_at: string;
}

export interface Availability {
  id: number;
  provider: number;
  service: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

export async function getProviders(): Promise<ProviderProfile[]> {
  const res = await apiClient.get("/providers/profiles/");
  return res.data;
}

export async function getProvider(id: string | number): Promise<ProviderProfile> {
  const res = await apiClient.get(`/providers/profiles/${id}/`);
  return res.data;
}

export async function getAvailability(serviceId: number): Promise<Availability[]> {
  const res = await apiClient.get("/providers/availability/", {
    params: { service: serviceId },
  });
  return res.data;
}
