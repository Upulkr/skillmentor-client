import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMentors } from "../../hooks/useMentors";
import api from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";

const subjectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  mentorId: z.string().min(1, "Please select a mentor"),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export function CreateSubject() {
  const { data: mentors } = useMentors();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
  });

  const mutation = useMutation({
    mutationFn: async (values: SubjectFormValues) => {
      return api.post("/subjects", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      navigate("/admin/subjects");
    },
  });

  const onSubmit = (data: SubjectFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Create New Subject
        </h1>
        <p className="text-slate-500 mt-2">
          Add a new subject to the platform and assign it to a mentor.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Subject Name
          </label>
          <input
            {...register("name")}
            className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
            placeholder="e.g. Advanced Java Concurrency"
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border ${errors.description ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
            placeholder="What will students learn in this subject?"
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Course Image URL
          </label>
          <input
            {...register("imageUrl")}
            className={`w-full px-4 py-3 rounded-xl border ${errors.imageUrl ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && (
            <p className="text-xs text-red-500 font-medium">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Assign Mentor
          </label>
          <select
            {...register("mentorId")}
            className={`w-full px-4 py-3 rounded-xl border ${errors.mentorId ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white`}
          >
            <option value="">Select a mentor</option>
            {mentors?.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.firstName} {mentor.lastName} - {mentor.title}
              </option>
            ))}
          </select>
          {errors.mentorId && (
            <p className="text-xs text-red-500 font-medium">
              {errors.mentorId.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Subject...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Create Subject
            </>
          )}
        </button>
      </form>
    </div>
  );
}
