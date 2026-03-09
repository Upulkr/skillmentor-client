import { useMySessions } from "../hooks/useSessions";
import { Badge } from "../components/ui/Badge";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ReviewModal } from "../components/ui/ReviewModal";
import {
  Calendar,
  Clock,
  Video,
  Upload,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

export function Dashboard() {
  const { data: sessions, isLoading, refetch } = useMySessions();
  const [reviewSession, setReviewSession] = useState<{
    id: number;
    subjectName: string;
  } | null>(null);

  if (isLoading)
    return (
      <div className="p-20 text-center text-slate-500 font-bold animate-pulse">
        Loading sessions...
      </div>
    );

  const pendingSessions =
    sessions?.filter((s) => s.paymentStatus === "PENDING") || [];
  const upcomingSessions =
    sessions?.filter((s) => s.status === "CONFIRMED") || [];

  return (
    <div className="py-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Student Dashboard
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Manage your learning journey
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left: Summary Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
              Overview
            </h3>
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-black text-slate-900">
                  {sessions?.length || 0}
                </div>
                <div className="text-xs font-bold text-slate-400 mt-1">
                  TOTAL SESSIONS
                </div>
              </div>
              <div className="pt-6 border-t border-slate-50">
                <div className="text-3xl font-black text-emerald-600">
                  {upcomingSessions.length}
                </div>
                <div className="text-xs font-bold text-slate-400 mt-1">
                  UPCOMING
                </div>
              </div>
              <div className="pt-6 border-t border-slate-50">
                <div className="text-3xl font-black text-amber-500">
                  {pendingSessions.length}
                </div>
                <div className="text-xs font-bold text-slate-400 mt-1">
                  AWAITING PAYMENT
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
            <h4 className="font-black mb-2">Need Help?</h4>
            <p className="text-indigo-100/80 text-sm font-medium mb-6">
              Our support team is available 24/7 for booking issues.
            </p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black tracking-widest transition-colors">
              CONTACT SUPPORT
            </button>
          </div>
        </div>

        {/* Right: Sessions List */}
        <div className="lg:col-span-3">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em] mb-6">
            Recent Sessions
          </h3>

          {sessions?.length === 0 ? (
            <div className="bg-slate-50 border-2 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                Ready to start learning?
              </h4>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                Browse our expert mentors and find a subject that matches your
                goals.
              </p>
              <Link
                to="/"
                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                EXPLORE MENTORS
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions?.map((session) => (
                <div
                  key={session.id}
                  className="group bg-white rounded-3xl border border-slate-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-center gap-5 flex-1">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
                      📚
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-slate-900">
                          {session.subjectName}
                        </h4>
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
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                        with {session.mentorName}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        {session.sessionDate}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {session.sessionTime} ({session.durationMinutes} min)
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {session.paymentStatus === "PENDING" ? (
                        <Link
                          to={`/payment/${session.id}`}
                          className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-amber-600 transition-all shadow-lg shadow-amber-100"
                        >
                          <Upload className="w-4 h-4" />
                          UPLOAD SLIP
                        </Link>
                      ) : session.status === "CONFIRMED" &&
                        session.meetingLink ? (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                          <Video className="w-4 h-4" />
                          JOIN SESSION
                        </a>
                      ) : session.status === "COMPLETED" ? (
                        <button
                          onClick={() =>
                            setReviewSession({
                              id: session.id,
                              subjectName: session.subjectName,
                            })
                          }
                          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg"
                        >
                          WRITE REVIEW
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm px-4">
                          <CheckCircle2 className="w-4 h-4" />
                          PAID
                        </div>
                      )}

                      <Link
                        to={`/sessions/${session.id}`}
                        className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {reviewSession && (
        <ReviewModal
          isOpen={!!reviewSession}
          onClose={() => setReviewSession(null)}
          onSuccess={() => refetch()}
          sessionId={reviewSession.id}
          subjectName={reviewSession.subjectName}
        />
      )}
    </div>
  );
}
