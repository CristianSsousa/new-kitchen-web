import { Copy, ExternalLink, Key, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { eventoApi } from "../services/api";
import type { CreateConvidadoRequest, Convidado } from "../types";

interface ConvidadoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (convidado: CreateConvidadoRequest) => Promise<void>;
    convidado?: Convidado;
    title: string;
}

const ConvidadoModal = ({
    isOpen,
    onClose,
    onSubmit,
    convidado,
    title,
}: ConvidadoModalProps) => {
    const [formData, setFormData] = useState<CreateConvidadoRequest>({
        nome: "",
        email: "",
        telefone: "",
        observacoes: "",
        guest_of: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [hosts, setHosts] = useState<string[]>([]);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        eventoApi.getEventoInfo().then((info) => setHosts(info.hosts ?? [])).catch(() => {});
    }, [isOpen]);

    useEffect(() => {
        if (convidado) {
            setFormData({
                nome: convidado.nome,
                email: convidado.email || "",
                telefone: convidado.telefone || "",
                observacoes: convidado.observacoes || "",
                guest_of: convidado.guest_of || "",
            });
        } else {
            setFormData({
                nome: "",
                email: "",
                telefone: "",
                observacoes: "",
                guest_of: "",
            });
        }
        setFieldErrors({});
    }, [convidado]);

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

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copiado para a área de transferência!`);
    };

    const getInviteLink = (codigo: string) => {
        return `${window.location.origin}/convidado/${codigo}`;
    };

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="flex fixed inset-0 z-50 justify-center items-center p-4 backdrop-blur-sm bg-black/60"
            onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="font-serif text-2xl font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 rounded-lg transition-colors hover:text-gray-600 hover:bg-gray-100"
                        aria-label="Fechar modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Informações do Código (apenas para edição) */}
                    {convidado && (
                        <div className="p-4 mb-6 rounded-xl border bg-primary-50 border-primary-100">
                            <h3 className="flex items-center mb-3 text-lg font-medium text-primary-900">
                                <Key className="mr-2 w-5 h-5" />
                                Código do Convidado
                            </h3>
                            
                            <div className="space-y-3">
                                {/* Código */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-primary-700">
                                        Código Único
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <code className="flex-1 px-3 py-2 font-mono text-lg font-bold bg-white rounded-lg border border-primary-200 text-primary-800">
                                            {convidado.codigo_unico}
                                        </code>
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(convidado.codigo_unico, "Código")}
                                            className="flex items-center px-3 py-2 space-x-1 text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700"
                                        >
                                            <Copy className="w-4 h-4" />
                                            <span className="text-sm">Copiar</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Link de Convite */}
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-primary-700">
                                        Link de Convite
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={getInviteLink(convidado.codigo_unico)}
                                            readOnly
                                            className="flex-1 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg border border-primary-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => copyToClipboard(getInviteLink(convidado.codigo_unico), "Link")}
                                            className="flex items-center px-3 py-2 space-x-1 text-white rounded-lg transition-colors bg-secondary-600 hover:bg-secondary-700"
                                        >
                                            <Copy className="w-4 h-4" />
                                            <span className="text-sm">Copiar</span>
                                        </button>
                                        <a
                                            href={getInviteLink(convidado.codigo_unico)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center px-3 py-2 space-x-1 text-white bg-gray-600 rounded-lg transition-colors hover:bg-gray-700"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            <span className="text-sm">Abrir</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Nome */}
                        <div className="md:col-span-2">
                            <label htmlFor="nome" className="form-label">
                                Nome Completo *
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
                                placeholder="Ex: João Silva"
                            />
                            {fieldErrors.nome && (
                                <p className="mt-1 text-xs text-red-500">{fieldErrors.nome}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                className="input-field"
                                placeholder="joao@email.com"
                            />
                        </div>

                        {/* Telefone */}
                        <div>
                            <label htmlFor="telefone" className="form-label">
                                Telefone
                            </label>
                            <input
                                type="tel"
                                id="telefone"
                                value={formData.telefone}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        telefone: e.target.value,
                                    })
                                }
                                className="input-field"
                                placeholder="(11) 99999-9999"
                            />
                        </div>

                        {/* Convidado de */}
                        {hosts.length > 0 && (
                            <div className="md:col-span-2">
                                <label htmlFor="guest_of" className="form-label">
                                    Convidado de
                                </label>
                                <select
                                    id="guest_of"
                                    value={formData.guest_of}
                                    onChange={(e) => setFormData({ ...formData, guest_of: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="">— Sem classificação —</option>
                                    {hosts.map((host) => (
                                        <option key={host} value={host}>{host}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Observações */}
                        <div className="md:col-span-2">
                            <label htmlFor="observacoes" className="form-label">
                                Observações
                            </label>
                            <textarea
                                id="observacoes"
                                value={formData.observacoes}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        observacoes: e.target.value,
                                    })
                                }
                                className="input-field min-h-[100px]"
                                placeholder="Informações adicionais sobre o convidado..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 justify-end items-center pt-6 mt-8 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors hover:text-gray-800 hover:bg-gray-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Salvando..." : convidado ? "Salvar Alterações" : "Criar Convidado"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConvidadoModal; 