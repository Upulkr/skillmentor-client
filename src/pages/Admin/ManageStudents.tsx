import { useUsers, useDeleteUser, useUpdateUser } from "../../hooks/useUsers";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";
import { Loader2, Trash2, Shield, User, Mail } from "lucide-react";
import { useToastStore } from "../../store/useToastStore";

export function ManageStudents() {
  const { data: users, isLoading } = useUsers();
  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const addToast = useToastStore((state) => state.addToast);

  const handleDelete = async (id: number) => {
    if (
      confirm(
        "Are you sure you want to delete this user? This action is permanent and will remove all their data.",
      )
    ) {
      try {
        await deleteUser.mutateAsync(id);
        addToast("User deleted successfully", "success");
      } catch (error) {
        addToast("Failed to delete user", "error");
      }
    }
  };

  const toggleRole = async (user: any) => {
    const newRole = user.role === "ADMIN" ? "STUDENT" : "ADMIN";
    try {
      await updateUser.mutateAsync({ id: user.id, data: { role: newRole } });
      addToast(`User role updated to ${newRole}`, "success");
    } catch (error) {
      addToast("Failed to update user role", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">
            Manage all students and administrative staff.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            Loading users...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt={user.firstName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-slate-900">
                          {user.firstName
                            ? `${user.firstName} ${user.lastName}`
                            : "Unnamed User"}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase">
                          ID: {user.clerkId.slice(0, 12)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleRole(user)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        user.role === "ADMIN"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {user.role === "ADMIN" ? (
                        <Shield className="w-3 h-3" />
                      ) : (
                        <User className="w-3 h-3" />
                      )}
                      {user.role}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deleteUser.isPending}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete User Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {users?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-40 text-center text-slate-400 italic"
                  >
                    No users found in the system.
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
