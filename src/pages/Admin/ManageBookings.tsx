import { useBookings, useUpdateBooking } from "../../hooks/useBookings";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  Video,
  Loader2,
} from "lucide-react";
import { useState } from "react";

export function ManageBookings() {
  const { data: bookings, isLoading } = useBookings();
  const updateMutation = useUpdateBooking();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState<"date" | "student" | "mentor">("date");

  const filtered = bookings
    ?.filter((b) => {
      const matchesSearch =
        b.studentName.toLowerCase().includes(search.toLowerCase()) ||
        b.mentorName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortKey === "date") return b.sessionDate.localeCompare(a.sessionDate);
      if (sortKey === "student")
        return a.studentName.localeCompare(b.studentName);
      if (sortKey === "mentor") return a.mentorName.localeCompare(b.mentorName);
      return 0;
    });

  const handleAction = (
    id: number,
    status: string,
    type: "payment" | "session",
  ) => {
    updateMutation.mutate({ id, status, type });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Session Bookings
          </h1>
          <p className="text-slate-500 mt-1">
            Manage student enrollments and payment confirmations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none pr-8 cursor-pointer shadow-sm"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-64 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            Loading bookings...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => setSortKey("student")}
                >
                  Student {sortKey === "student" && "↓"}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => setSortKey("mentor")}
                >
                  Mentor & Subject {sortKey === "mentor" && "↓"}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-indigo-600 transition-colors"
                  onClick={() => setSortKey("date")}
                >
                  Date & Time {sortKey === "date" && "↓"}
                </TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered?.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-bold text-slate-900">
                      {booking.studentName || "Unknown Student"}
                    </div>
                    <div className="text-xs text-slate-500">
                      ID: #{booking.studentId}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-700">
                      {booking.subjectName}
                    </div>
                    <div className="text-xs text-slate-400">
                      with {booking.mentorName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3.5 h-3.5" />
                      {booking.sessionDate} at {booking.sessionTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.paymentStatus === "CONFIRMED"
                          ? "success"
                          : booking.paymentStatus === "REJECTED"
                            ? "error"
                            : "warning"
                      }
                    >
                      {booking.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        booking.status === "COMPLETED"
                          ? "success"
                          : booking.status === "CANCELLED"
                            ? "error"
                            : "default"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(booking.paymentStatus === "PENDING" ||
                        booking.paymentStatus === "UNDER_REVIEW") && (
                        <div className="flex items-center gap-2">
                          {booking.paymentSlipUrl && (
                            <a
                              href={booking.paymentSlipUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100"
                              title="View Receipt"
                            >
                              <Search className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() =>
                              handleAction(booking.id, "CONFIRMED", "payment")
                            }
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Confirm Payment"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      {booking.status === "CONFIRMED" && (
                        <>
                          <button
                            onClick={() => {
                              const link = prompt(
                                "Enter meeting link:",
                                booking.meetingLink || "",
                              );
                              if (link !== null)
                                handleAction(booking.id, link, "session");
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Add Meeting Link"
                          >
                            <Video className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleAction(booking.id, "COMPLETED", "session")
                            }
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Mark Completed"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-40 text-center text-slate-400 italic"
                  >
                    No bookings found.
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
