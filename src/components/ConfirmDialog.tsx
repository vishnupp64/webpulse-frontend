import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, busy }: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting..." : "Confirm"}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-6 w-6 text-red-500" />
        <p className="text-sm text-slate-600">{message}</p>
      </div>
    </Modal>
  );
}