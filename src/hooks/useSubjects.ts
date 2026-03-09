import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import type { Subject } from "./useMentors";

export function useSubject(id: string | number | undefined) {
  return useQuery<Subject>({
    queryKey: ["subjects", id],
    queryFn: async () => {
      if (!id) throw new Error("Subject ID is required");
      const { data } = await api.get(`/subjects/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Subject>;
    }) => {
      const { data: response } = await api.put(`/subjects/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/subjects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
}
