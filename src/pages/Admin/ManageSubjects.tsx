import { useMentors } from "../../hooks/useMentors";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";
import { Link } from "react-router-dom";
import { Plus, Loader2, BookOpen, Trash2, Edit } from "lucide-react";
import { useDeleteSubject } from "../../hooks/useSubjects";
import { useToastStore } from "../../store/useToastStore";

export function ManageSubjects() {
  const { data: mentors, isLoading } = useMentors();
  const deleteSubject = useDeleteSubject();
  const addToast = useToastStore((state) => state.addToast);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      try {
        await deleteSubject.mutateAsync(id);
        addToast("Subject deleted successfully", "success");
      } catch (error) {
        addToast("Failed to delete subject", "error");
      }
    }
  };

  // Flatten subjects from all mentors
  const allSubjects = mentors?.flatMap((m) =>
    m.subjects.map((s) => ({
      ...s,
      mentorName: `${m.firstName} ${m.lastName}`,
    })),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Subjects Inventory
          </h1>
          <p className="text-slate-500 mt-1">
            Manage all available subjects and their assignments.
          </p>
        </div>
        <Link
          to="/admin/subjects/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          ADD NEW SUBJECT
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            Loading subjects...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Subject Name</TableHead>
                <TableHead>Assigned Mentor</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allSubjects?.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>
                    {subject.imageUrl ? (
                      <img
                        src={subject.imageUrl}
                        alt={subject.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 italic text-xs text-slate-400">
                        None
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900">
                      {subject.name}
                    </div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">
                      {subject.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-slate-700 font-medium">
                      {subject.mentorName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <BookOpen className="w-3.5 h-3.5" />
                      {/* Note: enrollmentCount usually comes from backend, mapping here if exists */}
                      {(subject as any).enrollmentCount || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <Link
                        to={`/admin/subjects/edit/${subject.id}`}
                        className="p-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(subject.id)}
                        disabled={deleteSubject.isPending}
                        className="p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {allSubjects?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-40 text-center text-slate-400 italic"
                  >
                    No subjects found. Add your first one!
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
