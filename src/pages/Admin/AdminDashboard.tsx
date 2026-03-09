import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import { Loader2, AlertCircle, Bell } from "lucide-react";

interface DashboardStats {
  totalMentors: number;
  totalSubjects: number;
  totalBookings: number;
  pendingPayments: number;
  recentActivities: {
    id: string;
    type: string;
    message: string;
    timeAgo: string;
  }[];
}

export function AdminDashboard() {
  const {
    data: stats,
    isLoading,
    isError,
  } = useQuery<DashboardStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/admin/stats");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium anim-pulse">
          Gathering platform analytics...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="font-bold">Failed to load statistics</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm bg-red-50 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Mentors",
      value: stats?.totalMentors ?? 0,
      color: "bg-blue-500",
    },
    {
      label: "Total Subjects",
      value: stats?.totalSubjects ?? 0,
      color: "bg-indigo-500",
    },
    {
      label: "Active Bookings",
      value: stats?.totalBookings ?? 0,
      color: "bg-emerald-500",
    },
    {
      label: "Pending Payments",
      value: stats?.pendingPayments ?? 0,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Admin Overview
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Real-time performance metrics and platform health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="group bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              {stat.label}
            </p>
            <p className="text-5xl font-black text-slate-900 tabular-nums">
              {stat.value}
            </p>
            <div
              className={`h-1.5 w-12 rounded-full mt-6 transition-all duration-500 group-hover:w-full ${stat.color}`}
            />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
            Live Feed
          </span>
        </div>

        <div className="space-y-6">
          {stats?.recentActivities && stats.recentActivities.length > 0 ? (
            stats.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 rounded-2xl px-4 -mx-4 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {activity.timeAgo}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-10 text-center text-slate-400">
              <p className="text-sm font-medium italic">
                No recent platform activity found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
