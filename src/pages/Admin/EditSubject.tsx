import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMentors } from "../../hooks/useMentors";
import { useSubject, useUpdateSubject } from "../../hooks/useSubjects";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useToastStore } from "../../store/useToastStore";

const subjectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  mentorId: z.coerce.number().min(1, "Please select a mentor"),
});

type SubjectFormValues = z.infer<typeof subjectSchema>;

export function EditSubject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { data: subject, isLoading: isLoadingSubject } = useSubject(id);
  const { data: mentors } = useMentors();
  const updateMutation = useUpdateSubject();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema) as any,
  });

  useEffect(() => {
    if (subject) {
      reset({
        name: subject.name,
        description: subject.description,
        imageUrl: subject.imageUrl || "",
        mentorId: subject.mentorId,
      });
    }
  }, [subject, reset]);

  const onSubmit = async (data: SubjectFormValues) => {
    try {
      await updateMutation.mutateAsync({ id: Number(id), data });
      addToast("Subject updated successfully", "success");
      navigate("/admin/subjects");
    } catch (error) {
      addToast("Failed to update subject", "error");
    }
  };

  if (isLoadingSubject) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Subjects
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Edit Subject
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Update the details for "{subject?.name}".
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Subject Name
          </label>
          <input
            {...register("name")}
            className={`w-full px-5 py-4 rounded-2xl border ${errors.name ? "border-red-500 bg-red-50" : "border-slate-200"} focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium`}
            placeholder="e.g. Advanced Java Concurrency"
          />
          {errors.name && (
            <p className="text-xs text-red-500 font-bold ml-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={4}
            className={`w-full px-5 py-4 rounded-2xl border ${errors.description ? "border-red-500 bg-red-50" : "border-slate-200"} focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium`}
            placeholder="What will students learn in this subject?"
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-bold ml-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Course Image URL
          </label>
          <input
            {...register("imageUrl")}
            className={`w-full px-5 py-4 rounded-2xl border ${errors.imageUrl ? "border-red-500 bg-red-50" : "border-slate-200"} focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.imageUrl && (
            <p className="text-xs text-red-500 font-bold ml-1">
              {errors.imageUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 ml-1">
            Assign Mentor
          </label>
          <select
            {...register("mentorId")}
            className={`w-full px-5 py-4 rounded-2xl border ${errors.mentorId ? "border-red-500 bg-red-50" : "border-slate-200"} focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white font-medium cursor-pointer`}
          >
            <option value="">Select a mentor</option>
            {mentors?.map((mentor) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.firstName} {mentor.lastName} — {mentor.title}
              </option>
            ))}
          </select>
          {errors.mentorId && (
            <p className="text-xs text-red-500 font-bold ml-1">
              {errors.mentorId.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-5 rounded-2xl font-black hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-200 active:scale-[0.98] cursor-pointer"
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              SAVING CHANGES...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              SAVE CHANGES
            </>
          )}
        </button>
      </form>
    </div>
  );
}
