import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Toaster() {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-brand-500" />,
  };
  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
        >
          {icons[t.type]}
          <p className="flex-1 text-sm text-slate-700">{t.message}</p>
          <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}