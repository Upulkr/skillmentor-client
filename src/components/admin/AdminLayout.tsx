import { useUser } from "@clerk/clerk-react";
import { useAuthStore } from "../../store/useAuthStore";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Receipt,
  LogOut,
  Loader2,
} from "lucide-react";

export function AdminLayout() {
  const { isLoaded, isSignedIn } = useUser();
  const role = useAuthStore((state) => state.role);
  const location = useLocation();

  // If Clerk is still loading, OR the user is signed in but our
  // custom role state hasn't been populated yet, we must wait.
  if (!isLoaded || (isSignedIn && role === null))
    return (
      <div className="p-20 text-center text-slate-500">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="font-medium">Authorizing access...</p>
        </div>
      </div>
    );

  // Check if role is ADMIN (case-insensitive)
  const isAdmin = role?.toUpperCase() === "ADMIN";

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const navItems = [
    { label: "Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Manage Subjects", path: "/admin/subjects", icon: BookOpen },
    { label: "Manage Mentors", path: "/admin/mentors", icon: Users },
    { label: "Bookings", path: "/admin/bookings", icon: Receipt },
    { label: "Manage Students", path: "/admin/students", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <Link
            to="/"
            className="text-xl font-extrabold text-indigo-600 tracking-tight flex items-center gap-2"
          >
            SkillMentor{" "}
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
