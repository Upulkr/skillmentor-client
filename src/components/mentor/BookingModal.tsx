import { useState } from "react";
import { useEnroll } from "../../hooks/useSessions";
import type { Mentor, Subject } from "../../hooks/useMentors";
import {
  X,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface BookingModalProps {
  mentor: Mentor;
  initialSubject?: Subject;
  onClose: () => void;
}

export function BookingModal({
  mentor,
  initialSubject,
  onClose,
}: BookingModalProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    initialSubject?.id || mentor.subjects[0]?.id,
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);
  const enrollMutation = useEnroll();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!selectedSubjectId || !date || !time) return;

    // VALIDATION: Prevent past dates/times & ensure 30 min buffer
    const selectedDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const minBufferTime = new Date(now.getTime() + 30 * 60000); // Now + 30 mins

    if (selectedDateTime < now) {
      setFormError(
        "You cannot book a session in the past. Please select a future date and time.",
      );
      return;
    }

    if (selectedDateTime < minBufferTime) {
      setFormError(
        "For today's bookings, please allow at least a 30-minute gap from the current time.",
      );
      return;
    }

    enrollMutation.mutate(
      {
        mentorId: mentor.id,
        subjectId: selectedSubjectId,
        sessionDate: date,
        sessionTime: time,
        durationMinutes: duration,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
      },
    );
  };

  const getErrorMessage = (error: any) => {
    if (error?.response?.data?.errors) {
      const fieldErrors = Object.values(error.response.data.errors) as string[];
      return fieldErrors[0];
    }
    return (
      error?.response?.data?.message ||
      "Conflict detected. Please choose a different slot."
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
              Booking Requested!
            </h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm">
              Your session request has been sent to {mentor.firstName}. To
              confirm the booking, please upload your payment slip in the
              dashboard.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
              >
                GOT IT
              </button>
            </div>
          </div>
        ) : (
          <div className="p-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
              Book a Session
            </h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">
              with {mentor.firstName} {mentor.lastName}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  Select Subject
                </label>
                <select
                  className="w-full px-5 py-4 bg-slate-100/50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                  value={selectedSubjectId}
                  onChange={(e) =>
                    setSelectedSubjectId(parseInt(e.target.value))
                  }
                >
                  {mentor.subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="date"
                      className="w-full pl-11 pr-4 py-4 bg-slate-100/50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                      min={new Date().toISOString().split("T")[0]}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="time"
                      className="w-full pl-11 pr-4 py-4 bg-slate-100/50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all cursor-pointer"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  Duration (Minutes)
                </label>
                <div className="flex gap-2">
                  {[30, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border cursor-pointer active:scale-95 ${
                        duration === d
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100"
                          : "bg-white border-slate-100 text-slate-600 hover:border-indigo-200"
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              {(enrollMutation.isError || formError) && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    {formError || getErrorMessage(enrollMutation.error)}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={enrollMutation.isPending}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all mt-4"
              >
                {enrollMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    CHECKING SLOTS...
                  </span>
                ) : (
                  "REQUEST BOOKING"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
