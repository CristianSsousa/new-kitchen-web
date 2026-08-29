import { Baby, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Confirmacao } from "../types";

export interface ConfirmacaoFormData {
    nome: string;
    quantidade_adultos: number;
    quantidade_criancas: number;
}

interface ConfirmacaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ConfirmacaoFormData) => Promise<void>;
    confirmacao?: Confirmacao;
}

const ConfirmacaoModal = ({
    isOpen,
    onClose,
    onSubmit,
    confirmacao,
}: ConfirmacaoModalProps) => {
    const [formData, setFormData] = useState<ConfirmacaoFormData>({
        nome: "",
        quantidade_adultos: 1,
        quantidade_criancas: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (confirmacao) {
            setFormData({
                nome: confirmacao.nome,
                quantidade_adultos: confirmacao.quantidade_adultos,
                quantidade_criancas: confirmacao.quantidade_criancas,
            });
        }
        setFieldErrors({});
    }, [confirmacao]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const validate = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.nome.trim()) errors.nome = "Nome é obrigatório";
        if (formData.quantidade_adultos < 1) errors.quantidade_adultos = "Mínimo de 1 adulto";
        if (formData.quantidade_criancas < 0) errors.quantidade_criancas = "Não pode ser negativo";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setSubmitting(true);
            await onSubmit(formData);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-serif font-semibold text-gray-900">
                        Editar Confirmação
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                        aria-label="Fechar modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="nome" className="form-label">
                            Nome
                        </label>
                        <input
                            type="text"
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => {
                                setFormData({ ...formData, nome: e.target.value });
                                if (fieldErrors.nome) setFieldErrors((prev) => ({ ...prev, nome: "" }));
                            }}
                            className={`input-field ${fieldErrors.nome ? "border-red-400 focus:ring-red-300" : ""}`}
                        />
                        {fieldErrors.nome && (
                            <p className="mt-1 text-xs text-red-500">{fieldErrors.nome}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="quantidade_adultos" className="form-label flex items-center gap-1.5">
                                <Users className="w-4 h-4" /> Adultos
                            </label>
                            <input
                                type="number"
                                id="quantidade_adultos"
                                min={1}
                                value={formData.quantidade_adultos}
                                onChange={(e) => {
                                    const parsed = parseInt(e.target.value, 10);
                                    setFormData({
                                        ...formData,
                                        quantidade_adultos: isNaN(parsed) ? 0 : parsed,
                                    });
                                    if (fieldErrors.quantidade_adultos) setFieldErrors((prev) => ({ ...prev, quantidade_adultos: "" }));
                                }}
                                className={`input-field ${fieldErrors.quantidade_adultos ? "border-red-400 focus:ring-red-300" : ""}`}
                            />
                            {fieldErrors.quantidade_adultos && (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.quantidade_adultos}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="quantidade_criancas" className="form-label flex items-center gap-1.5">
                                <Baby className="w-4 h-4" /> Crianças
                            </label>
                            <input
                                type="number"
                                id="quantidade_criancas"
                                min={0}
                                value={formData.quantidade_criancas}
                                onChange={(e) => {
                                    const parsed = parseInt(e.target.value, 10);
                                    setFormData({
                                        ...formData,
                                        quantidade_criancas: isNaN(parsed) ? 0 : parsed,
                                    });
                                    if (fieldErrors.quantidade_criancas) setFieldErrors((prev) => ({ ...prev, quantidade_criancas: "" }));
                                }}
                                className={`input-field ${fieldErrors.quantidade_criancas ? "border-red-400 focus:ring-red-300" : ""}`}
                            />
                            {fieldErrors.quantidade_criancas && (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.quantidade_criancas}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfirmacaoModal;
