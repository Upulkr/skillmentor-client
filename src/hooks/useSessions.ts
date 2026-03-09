import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export interface Session {
  id: number;
  mentorId: number;
  mentorName: string;
  subjectId: number;
  subjectName: string;
  sessionDate: string;
  sessionTime: string;
  durationMinutes: number;
  paymentStatus: "PENDING" | "CONFIRMED" | "REJECTED";
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  meetingLink?: string;
}

export function useMySessions() {
  return useQuery<Session[]>({
    queryKey: ["sessions", "me"],
    queryFn: async () => {
      const { data } = await api.get("/sessions/my-sessions");
      return data;
    },
  });
}

export function useSession(sessionId: number | undefined) {
  return useQuery<Session>({
    queryKey: ["sessions", sessionId],
    queryFn: async () => {
      const { data } = await api.get(`/sessions/${sessionId}`);
      return data;
    },
    enabled: !!sessionId,
  });
}

export interface EnrollmentRequest {
  mentorId: number;
  subjectId: number;
  sessionDate: string;
  sessionTime: string;
  durationMinutes: number;
}

export function useEnroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: EnrollmentRequest) => {
      const { data } = await api.post("/sessions/enroll", request);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", "me"] });
    },
  });
}

export function useUploadPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      file,
    }: {
      sessionId: number;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post(
        `/sessions/${sessionId}/payment-slip`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions", "me"] });
    },
  });
}
