import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useUploadPayment, useMySessions } from "../hooks/useSessions";
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Receipt,
} from "lucide-react";

export function Payment() {
  const { id } = useParams<{ id: string }>();
  const sessionId = parseInt(id || "0");
  const navigate = useNavigate();
  const { data: sessions } = useMySessions();
  const session = sessions?.find((s) => s.id === sessionId);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadMutation = useUploadPayment();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !sessionId) return;
    uploadMutation.mutate(
      { sessionId, file },
      {
        onSuccess: () => {
          // Redirect back to dashboard after success
          setTimeout(() => navigate("/dashboard"), 2000);
        },
      },
    );
  };

  if (!session && sessions)
    return (
      <div className="p-20 text-center text-red-500">Session not found.</div>
    );

  return (
    <div className="py-12 px-6 max-w-2xl mx-auto">
      <Link
        to="/dashboard"
        className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-indigo-600 mb-8 transition-colors uppercase tracking-widest"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Link>

      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200 shadow-sm">
          <Receipt className="w-8 h-8 text-amber-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Complete Your Payment
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Please upload a photo of your bank deposit slip or transfer receipt.
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/50">
        <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Session Summary
            </span>
            <span className="text-xs font-black text-indigo-600">
              ID: #{sessionId}
            </span>
          </div>
          <div className="text-lg font-black text-slate-900 mb-1">
            {session?.subjectName}
          </div>
          <div className="text-sm font-bold text-slate-500">
            with {session?.mentorName}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
            <span className="text-sm text-slate-600 font-medium">
              Amount Due
            </span>
            <span className="text-xl font-black text-slate-900">$50.00</span>
          </div>
        </div>

        {uploadMutation.isSuccess ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Upload Successful!
            </h3>
            <p className="text-slate-500 font-medium">
              An admin will review your payment shortly. You'll be redirected
              soon...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label className="block p-8 border-2 border-dashed border-slate-200 rounded-3xl hover:border-indigo-400 hover:bg-slate-50 transition-all cursor-pointer text-center group">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {!preview ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Upload className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      Click to upload bank slip
                    </div>
                    <p className="text-xs text-slate-400 font-medium">
                      Supports JPG, PNG (Max 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="relative group/preview">
                    <img
                      src={preview}
                      alt="Receipt Preview"
                      className="max-h-64 mx-auto rounded-xl shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                      <span className="text-white text-xs font-black tracking-widest">
                        CHANGE PHOTO
                      </span>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {uploadMutation.isError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold">
                <AlertCircle className="w-5 h-5" />
                Failed to upload. Please try again or check file size.
              </div>
            )}

            <button
              type="submit"
              disabled={!file || uploadMutation.isPending}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200"
            >
              {uploadMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  UPLOADING...
                </span>
              ) : (
                "CONFIRM PAYMENT"
              )}
            </button>
          </form>
        )}
      </div>

      <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
        <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          <AlertCircle className="w-4 h-4" />
          Bank Details
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-400 font-bold text-[10px] uppercase">
              Bank Name
            </div>
            <div className="text-slate-900 font-bold">
              Central National Bank
            </div>
          </div>
          <div>
            <div className="text-slate-400 font-bold text-[10px] uppercase">
              Account Name
            </div>
            <div className="text-slate-900 font-bold">SkillMentor Platform</div>
          </div>
          <div className="col-span-2">
            <div className="text-slate-400 font-bold text-[10px] uppercase">
              Account Number
            </div>
            <div className="text-xl font-black text-slate-900 tracking-wider">
              0045 1290 8876 1123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
