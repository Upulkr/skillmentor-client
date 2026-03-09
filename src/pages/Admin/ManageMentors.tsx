import { useMentors, useDeleteMentor } from "../../hooks/useMentors";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";
import { Link } from "react-router-dom";
import { Plus, Loader2, Trash2, Edit, UserCheck, UserX } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

export function ManageMentors() {
  const { data: mentors, isLoading } = useMentors();
  const deleteMentor = useDeleteMentor();
  const addToast = useToastStore((state) => state.addToast);

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this mentor? This will NOT delete their user account, but they will no longer be listed as a mentor.",
      )
    ) {
      try {
        await deleteMentor.mutateAsync(id);
        addToast("Mentor removed successfully", "success");
      } catch (error) {
        addToast("Failed to remove mentor", "error");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Mentors Management
          </h1>
          <p className="text-slate-500 mt-1">
            View and manage all registered mentors on the platform.
          </p>
        </div>
        <Link
          to="/admin/mentors/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          REGISTER NEW MENTOR
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            Loading mentors...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mentor</TableHead>
                <TableHead>Professional Title</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mentors?.map((mentor) => (
                <TableRow key={mentor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {mentor.profileImageUrl ? (
                        <img
                          src={mentor.profileImageUrl}
                          alt={mentor.firstName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold uppercase">
                          {mentor.firstName[0]}
                          {mentor.lastName[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900">
                          {mentor.firstName} {mentor.lastName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {mentor.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-slate-700 font-medium">
                      {mentor.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {mentor.profession} at {mentor.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-slate-600 font-medium">
                      {mentor.experienceYears} Years
                    </div>
                  </TableCell>
                  <TableCell>
                    {mentor.isCertified ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold w-fit">
                        <UserCheck className="w-3.5 h-3.5" />
                        CERTIFIED
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full text-xs font-bold w-fit">
                        <UserX className="w-3.5 h-3.5" />
                        STANDARD
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <Link
                        to={`/admin/mentors/edit/${mentor.id}`}
                        className="p-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(mentor.id)}
                        disabled={deleteMentor.isPending}
                        className="p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {mentors?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-40 text-center text-slate-400 italic"
                  >
                    No mentors found. Register your first one!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
