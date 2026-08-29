import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
    isOpen,
    title,
    message,
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    danger = true,
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                <div className="p-6 text-center space-y-3">
                    <div
                        className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                            danger ? "bg-red-100" : "bg-primary-100"
                        }`}
                    >
                        <AlertTriangle className={`w-6 h-6 ${danger ? "text-red-500" : "text-primary-500"}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500">{message}</p>
                </div>
                <div className="flex gap-3 p-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            danger ? "bg-red-600 hover:bg-red-700" : "bg-primary-600 hover:bg-primary-700"
                        }`}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
