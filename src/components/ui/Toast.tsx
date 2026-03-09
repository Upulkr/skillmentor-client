import { useToastStore } from "../../store/useToastStore";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  AlertTriangle,
} from "lucide-react";
import { cn } from "../../lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-center gap-3 px-5 py-4 min-w-[320px] rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-right-10",
            toast.type === "success" &&
              "bg-emerald-50 border-emerald-100 text-emerald-900",
            toast.type === "error" &&
              "bg-rose-50 border-rose-100 text-rose-900",
            toast.type === "info" && "bg-sky-50 border-sky-100 text-sky-900",
            toast.type === "warning" &&
              "bg-amber-50 border-amber-100 text-amber-900",
          )}
        >
          <div className="flex-shrink-0">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
            {toast.type === "info" && <Info className="w-5 h-5" />}
            {toast.type === "warning" && <AlertTriangle className="w-5 h-5" />}
          </div>

          <div className="flex-grow text-sm font-bold pr-2">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
