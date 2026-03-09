import { Routes, Route, Link } from "react-router-dom";
import {
  UserButton,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { Home } from "./pages/Home";
import { MentorProfile } from "./pages/MentorProfile";
import { Dashboard } from "./pages/Dashboard";
import { Payment } from "./pages/Payment";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";
import { CreateSubject } from "./pages/Admin/CreateSubject";
import { CreateMentor } from "./pages/Admin/CreateMentor";
import { ManageBookings } from "./pages/Admin/ManageBookings";
import { ManageSubjects } from "./pages/Admin/ManageSubjects";
import { EditSubject } from "./pages/Admin/EditSubject";
import { ManageMentors } from "./pages/Admin/ManageMentors";
import { EditMentor } from "./pages/Admin/EditMentor";
import { ManageStudents } from "./pages/Admin/ManageStudents";
import { SessionDetails } from "./pages/SessionDetails";
import { useAuthStore } from "./store/useAuthStore";
import { ToastContainer } from "./components/ui/Toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const role = useAuthStore((state) => state.role);
  const isAdmin = role?.toUpperCase() === "ADMIN";

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      <nav className="flex items-center justify-between p-4 px-8 bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <Link
          to="/"
          className="text-xl font-extrabold text-indigo-600 tracking-tighter"
        >
          SKILL<span className="text-slate-900">MENTOR</span>
        </Link>
        <div className="flex items-center gap-10">
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-black text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider"
            >
              Browse
            </Link>
            <SignedIn>
              <Link
                to="/dashboard"
                className="text-sm font-black text-slate-600 hover:text-indigo-600 transition-colors uppercase tracking-wider"
              >
                My Learning
              </Link>
            </SignedIn>
            {isAdmin && (
              <Link
                to="/admin"
                className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
              >
                Admin Panel
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "w-10 h-10 border-2 border-indigo-100 p-0.5",
                    userButtonPopoverCard:
                      "shadow-2xl border-slate-200 rounded-2xl",
                  },
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg active:scale-95 uppercase tracking-wider">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto min-h-[calc(100vh-200px)]">
        {children}
      </main>
      <footer className="border-t bg-slate-50 mt-20 py-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          <div>
            <div className="text-xl font-extrabold text-indigo-600 tracking-tighter mb-2">
              SKILLMENTOR
            </div>
            <p className="text-slate-500 text-sm">
              Professional guidance for the next generation of creators.
            </p>
          </div>
          <div className="flex justify-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-indigo-600">
              Home
            </Link>
            <Link to="/dashboard" className="hover:text-indigo-600">
              Help
            </Link>
            {isAdmin && (
              <Link to="/admin" className="hover:text-indigo-600">
                Admin
              </Link>
            )}
          </div>
          <div className="text-right text-slate-400 text-xs font-medium">
            © 2026 SkillMentor API Project. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/mentors/:id"
        element={
          <Layout>
            <MentorProfile />
          </Layout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/payment/:id"
        element={
          <Layout>
            <Payment />
          </Layout>
        }
      />
      <Route
        path="/sessions/:id"
        element={
          <Layout>
            <SessionDetails />
          </Layout>
        }
      />

      {/* Admin Routes with Custom Sidebar Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="subjects" element={<ManageSubjects />} />
        <Route path="subjects/new" element={<CreateSubject />} />
        <Route path="subjects/edit/:id" element={<EditSubject />} />
        <Route path="mentors" element={<ManageMentors />} />
        <Route path="mentors/new" element={<CreateMentor />} />
        <Route path="mentors/edit/:id" element={<EditMentor />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="bookings" element={<ManageBookings />} />
      </Route>
    </Routes>
  );
}

export default App;
