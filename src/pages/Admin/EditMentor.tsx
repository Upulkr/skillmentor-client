import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMentor, useUpdateMentor } from "../../hooks/useMentors";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Save, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useToastStore } from "../../store/useToastStore";

const mentorSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  title: z.string().min(3, "Title is required (e.g. Senior Engineer)"),
  profession: z.string().min(2, "Profession is required"),
  company: z.string().min(2, "Company name is required"),
  experienceYears: z.coerce.number().min(0, "Experience must be 0 or more"),
  bio: z.string().min(20, "Bio must be at least 20 characters"),
  profileImageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  isCertified: z.boolean().default(false),
  startYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
});

type MentorFormValues = z.infer<typeof mentorSchema>;

export function EditMentor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { data: mentor, isLoading: isLoadingMentor } = useMentor(id);
  const updateMutation = useUpdateMentor();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MentorFormValues>({
    resolver: zodResolver(mentorSchema) as any,
  });

  useEffect(() => {
    if (mentor) {
      reset({
        firstName: mentor.firstName,
        lastName: mentor.lastName,
        email: mentor.email,
        title: mentor.title,
        profession: mentor.profession,
        company: mentor.company,
        experienceYears: mentor.experienceYears,
        bio: mentor.bio,
        profileImageUrl: mentor.profileImageUrl || "",
        isCertified: mentor.isCertified,
        startYear: mentor.startYear || new Date().getFullYear(),
      });
    }
  }, [mentor, reset]);

  const onSubmit = async (data: MentorFormValues) => {
    try {
      await updateMutation.mutateAsync({ id: Number(id), data });
      addToast("Mentor updated successfully", "success");
      navigate("/admin/mentors");
    } catch (error) {
      addToast("Failed to update mentor", "error");
    }
  };

  const previewImage = watch("profileImageUrl");

  if (isLoadingMentor) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Mentors
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Edit Mentor</h1>
        <p className="text-slate-500 mt-2">
          Update professional details for {mentor?.firstName} {mentor?.lastName}
          .
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.firstName ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.lastName ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Email Address (Primary Login)
              </label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Professional Title
              </label>
              <input
                {...register("title")}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Profession
                </label>
                <input
                  {...register("profession")}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.profession ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Company
                </label>
                <input
                  {...register("company")}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.company ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Experience Years
                </label>
                <input
                  {...register("experienceYears")}
                  type="number"
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.experienceYears ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Start Year
                </label>
                <input
                  {...register("startYear")}
                  type="number"
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.startYear ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">Bio</label>
              <textarea
                {...register("bio")}
                rows={5}
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.bio ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Profile Image URL
              </label>
              <input
                {...register("profileImageUrl")}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <input
                type="checkbox"
                id="isCertified"
                {...register("isCertified")}
                className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="isCertified"
                className="text-sm font-bold text-slate-700 cursor-pointer"
              >
                Is this mentor certified by SkillMentor?
              </label>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-100"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
              Live Preview
            </h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">👤</span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-900">
                    {watch("firstName") || "First"}{" "}
                    {watch("lastName") || "Last"}
                  </h4>
                  {watch("isCertified") && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mb-3">
                  {watch("title") || "Professional Title"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
