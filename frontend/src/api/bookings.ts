import apiClient from "./client";

export interface Booking {
  id: number;
  availability: number;
  status: string;
  created_at: string;
  provider_name: string;
  service_title: string;
  start_time: string;
  end_time: string;
}

export async function createBooking(availabilityId: number): Promise<Booking> {
  const res = await apiClient.post("/bookings/create/", {
    availability_id: availabilityId,
  });
  return res.data;
}

export async function getMyBookings(): Promise<Booking[]> {
  const res = await apiClient.get("/bookings/mine/");
  return res.data;
}
