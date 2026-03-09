import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export interface Booking {
  id: number;
  studentId: number;
  studentName: string;
  mentorId: number;
  mentorName: string;
  subjectId: number;
  subjectName: string;
  sessionDate: string;
  sessionTime: string;
  durationMinutes: number;
  paymentStatus: "PENDING" | "UNDER_REVIEW" | "CONFIRMED" | "REJECTED";
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  meetingLink?: string;
  paymentSlipUrl?: string;
}

export function useBookings() {
  return useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data } = await api.get("/sessions/admin/all");
      return data;
    },
  });
}

export function useUpdateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      type,
    }: {
      id: number;
      status: string;
      type: "payment" | "session";
    }) => {
      let endpoint = "";
      let payload: any = null;

      if (type === "payment") {
        endpoint = `/sessions/admin/${id}/confirm-payment`;
      } else {
        if (status === "COMPLETED") {
          endpoint = `/sessions/admin/${id}/complete`;
        } else {
          // Assume status is a URL for meeting-link if it's not COMPLETED in session type updates
          endpoint = `/sessions/admin/${id}/meeting-link`;
          payload = { meetingLink: status }; // Send as object to match DTO
        }
      }

      return api.post(endpoint, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
