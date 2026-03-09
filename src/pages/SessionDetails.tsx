import { useParams, Link } from "react-router-dom";
import { useSession } from "../hooks/useSessions";
import { Badge } from "../components/ui/Badge";
import {
  Calendar,
  Clock,
  Video,
  Upload,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  FileText,
} from "lucide-react";

export function SessionDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: session, isLoading, error } = useSession(Number(id));

  if (isLoading) {
    return (
      <div className="p-20 text-center text-slate-500 font-bold animate-pulse">
        Fetching session details...
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="p-20 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Session Not Found
        </h2>
        <p className="text-slate-500 mb-8 font-medium">
          We couldn't find the session you're looking for. It might have been
          deleted or you may not have permission to view it.
        </p>
        <Link
          to="/dashboard"
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black hover:bg-slate-800 transition-all"
        >
          BACK TO DASHBOARD
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-6 lg:px-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/dashboard"
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-indigo-600"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Session Details
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Reference #{session.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl">
                  📚
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {session.subjectName}
                  </h2>
                  <p className="text-indigo-600 font-bold">
                    with {session.mentorName}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  session.status === "COMPLETED"
                    ? "success"
                    : session.status === "CANCELLED"
                      ? "error"
                      : "default"
                }
              >
                {session.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  Date
                </div>
                <div className="font-black text-slate-900">
                  {session.sessionDate}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  Time
                </div>
                <div className="font-black text-slate-900">
                  {session.sessionTime}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3" />
                  Duration
                </div>
                <div className="font-black text-slate-900">
                  {session.durationMinutes} Minutes
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Link Section */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <Video className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-black">Virtual Classroom</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Link becomes active after confirmation
                  </p>
                </div>
              </div>
            </div>

            {session.meetingLink ? (
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between font-mono text-sm overflow-hidden whitespace-nowrap">
                  <span className="text-indigo-300 truncate">
                    {session.meetingLink}
                  </span>
                </div>
                <a
                  href={session.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2"
                >
                  JOIN NOW <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-slate-400 text-sm font-medium">
                The meeting link will be provided by your mentor once the
                payment is confirmed.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <CreditCard className="w-3 h-3" />
              Payment Status
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-slate-900 font-bold">Status</div>
                <Badge
                  variant={
                    session.paymentStatus === "CONFIRMED"
                      ? "success"
                      : session.paymentStatus === "PENDING"
                        ? "warning"
                        : "default"
                  }
                >
                  {session.paymentStatus}
                </Badge>
              </div>

              {session.paymentStatus === "PENDING" && (
                <Link
                  to={`/payment/${session.id}`}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-100"
                >
                  <Upload className="w-4 h-4" />
                  UPLOAD PAYMENT SLIP
                </Link>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Instructions
            </h3>
            <ul className="space-y-4">
              {[
                "Ensure your camera and mic are working.",
                "Join at least 5 minutes before start.",
                "Prepare questions for your mentor.",
                "Payment slips take up to 24h to verify.",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-slate-600 font-medium leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
