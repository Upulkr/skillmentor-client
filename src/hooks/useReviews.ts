import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export interface Review {
  id: number;
  studentName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface ReviewRequest {
  sessionId: number;
  rating: number;
  reviewText?: string;
}

export function useMentorReviews(mentorId: number | string | undefined) {
  return useQuery<Review[]>({
    queryKey: ["reviews", "mentor", mentorId],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/mentor/${mentorId}`);
      return data;
    },
    enabled: !!mentorId,
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReviewRequest) => {
      const response = await api.post("/reviews", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate both my sessions and mentor reviews
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}
