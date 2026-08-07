import { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

export function EmptyState({ title, description, icon }: {
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mb-3 text-slate-300">{icon ?? <Inbox className="h-10 w-10" />}</div>
      <h3 className="font-semibold text-slate-700">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-8 text-center">
      <AlertTriangle className="mb-3 h-8 w-8 text-red-500" />
      <h3 className="font-semibold text-red-700">Something went wrong</h3>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      {onRetry && (
        <button className="btn btn-secondary mt-4" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-14 text-slate-400">
      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}