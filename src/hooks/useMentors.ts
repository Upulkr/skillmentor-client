import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export interface Subject {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  enrollmentCount?: number;
  mentorId: number;
}

export interface Mentor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
  profession: string;
  company: string;
  experienceYears: number;
  bio: string;
  profileImageUrl?: string;
  isCertified: boolean;
  startYear?: number;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  subjects: Subject[];
}

export function useMentors() {
  return useQuery<Mentor[]>({
    queryKey: ["mentors"],
    queryFn: async () => {
      const { data } = await api.get("/mentors");
      return data;
    },
  });
}

export function useMentor(id: string | number | undefined) {
  return useQuery<Mentor>({
    queryKey: ["mentor", id],
    queryFn: async () => {
      if (!id) throw new Error("Mentor ID is required");
      const { data } = await api.get(`/mentors/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Mentor> }) => {
      const { data: response } = await api.put(`/mentors/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}

export function useDeleteMentor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/mentors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
    },
  });
}
