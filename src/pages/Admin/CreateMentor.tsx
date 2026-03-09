import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import api from "../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, UserPlus } from "lucide-react";

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
  isCertified: z.boolean(),
  startYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
});

type MentorFormValues = z.infer<typeof mentorSchema>;

export function CreateMentor() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MentorFormValues>({
    resolver: zodResolver(mentorSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      title: "",
      profession: "",
      company: "",
      bio: "",
      experienceYears: 0,
      isCertified: false,
      startYear: new Date().getFullYear(),
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: MentorFormValues) => {
      return api.post("/mentors", values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      navigate("/admin/mentors");
    },
  });

  const onSubmit = (data: MentorFormValues) => {
    mutation.mutate(data);
  };

  const previewImage = watch("profileImageUrl");

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Add New Mentor</h1>
        <p className="text-slate-500 mt-2">
          Register a new expert mentor to the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
          >
            {/* Name Group */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  First Name
                </label>
                <input
                  {...register("firstName")}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.firstName ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Last Name
                </label>
                <input
                  {...register("lastName")}
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.lastName ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700">
                Professional Title
              </label>
              <input
                {...register("title")}
                placeholder="e.g. Senior Software Architect"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.title ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
              />
              {errors.title && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.title.message}
                </p>
              )}
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
                  Years of Experience
                </label>
                <input
                  {...register("experienceYears", { valueAsNumber: true })}
                  type="number"
                  className={`w-full px-4 py-2.5 rounded-xl border ${errors.experienceYears ? "border-red-500" : "border-slate-200"} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700">
                  Start Year
                </label>
                <input
                  {...register("startYear", { valueAsNumber: true })}
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
              {errors.bio && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.bio.message}
                </p>
              )}
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
              disabled={mutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-100"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Register Mentor
                </>
              )}
            </button>
          </form>
        </div>

        {/* Preview Column */}
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
                  <h4 className="font-bold text-slate-900 border-b-2 border-transparent hover:border-indigo-500 transition-all cursor-default">
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
                <div className="text-xs text-slate-600 line-clamp-2 h-8">
                  {watch("bio") || "Mentor bio will appear here..."}
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <p className="text-xs text-amber-800 leading-relaxed italic">
                "Ensure all information is accurate. This profile will be
                immediately visible to students upon successful registration."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
