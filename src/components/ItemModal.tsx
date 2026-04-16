import { ExternalLink, Image, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CreateItemRequest, Item } from "../types";
import { CATEGORIAS } from "../types";

interface ItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (item: CreateItemRequest) => Promise<void>;
    item?: Item;
    title: string;
}

const ItemModal = ({
    isOpen,
    onClose,
    onSubmit,
    item,
    title,
}: ItemModalProps) => {
    const [formData, setFormData] = useState<CreateItemRequest>({
        nome: "",
        descricao: "",
        categoria: "Outros",
        preco: 0,
        imagem_url: "",
        link_url: "",
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (item) {
            setFormData({
                nome: item.nome,
                descricao: item.descricao,
                categoria: item.categoria,
                preco: item.preco,
                imagem_url: item.imagem_url,
                link_url: item.link_url || "",
            });
            setPreviewImage(item.imagem_url);
        } else {
            setFormData({
                nome: "",
                descricao: "",
                categoria: "Outros",
                preco: 0,
                imagem_url: "",
                link_url: "",
            });
            setPreviewImage(null);
        }
        setFieldErrors({});
    }, [item]);

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
        if (!formData.descricao.trim()) errors.descricao = "Descrição é obrigatória";
        if (!formData.imagem_url.trim()) errors.imagem_url = "URL da imagem é obrigatória";
        if (formData.preco < 0) errors.preco = "Preço não pode ser negativo";
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

    const handleImageUrlChange = (url: string) => {
        setFormData({ ...formData, imagem_url: url });
        setPreviewImage(url);
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
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-serif font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                        aria-label="Fechar modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Coluna da Esquerda - Informações Básicas */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="nome" className="form-label">
                                    Nome do Item
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
                                    placeholder="Ex: Jogo de Panelas"
                                />
                                {fieldErrors.nome && (
                                    <p className="mt-1 text-xs text-red-500">{fieldErrors.nome}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="descricao" className="form-label">
                                    Descrição
                                </label>
                                <textarea
                                    id="descricao"
                                    value={formData.descricao}
                                    onChange={(e) => {
                                        setFormData({ ...formData, descricao: e.target.value });
                                        if (fieldErrors.descricao) setFieldErrors((prev) => ({ ...prev, descricao: "" }));
                                    }}
                                    className={`input-field min-h-[120px] ${fieldErrors.descricao ? "border-red-400 focus:ring-red-300" : ""}`}
                                    placeholder="Descreva o item em detalhes..."
                                />
                                {fieldErrors.descricao && (
                                    <p className="mt-1 text-xs text-red-500">{fieldErrors.descricao}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="categoria"
                                        className="form-label"
                                    >
                                        Categoria
                                    </label>
                                    <select
                                        id="categoria"
                                        value={formData.categoria}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                categoria: e.target.value,
                                            })
                                        }
                                        className="input-field"
                                        required
                                    >
                                        {CATEGORIAS.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="preco"
                                        className="form-label"
                                    >
                                        Preço (R$)
                                    </label>
                                    <input
                                        type="number"
                                        id="preco"
                                        value={formData.preco}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                preco: parseFloat(
                                                    e.target.value
                                                ),
                                            })
                                        }
                                        className="input-field"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Coluna da Direita - Imagem e Links */}
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">
                                    Imagem do Item
                                </label>
                                <div className="mt-1 border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                                    {previewImage ? (
                                        <div className="relative aspect-video">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-lg"
                                                onError={() =>
                                                    setPreviewImage(null)
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center aspect-video bg-gray-100 rounded-lg">
                                            <Image className="h-12 w-12 text-gray-400" />
                                        </div>
                                    )}

                                    <input
                                        type="url"
                                        id="imagem_url"
                                        value={formData.imagem_url}
                                        onChange={(e) => {
                                            handleImageUrlChange(e.target.value);
                                            if (fieldErrors.imagem_url) setFieldErrors((prev) => ({ ...prev, imagem_url: "" }));
                                        }}
                                        className={`input-field mt-3 ${fieldErrors.imagem_url ? "border-red-400 focus:ring-red-300" : ""}`}
                                        placeholder="Cole a URL da imagem aqui"
                                    />
                                    {fieldErrors.imagem_url && (
                                        <p className="mt-1 text-xs text-red-500">{fieldErrors.imagem_url}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="link_url"
                                    className="form-label"
                                >
                                    Link de Referência
                                </label>
                                <div className="relative">
                                    <input
                                        type="url"
                                        id="link_url"
                                        value={formData.link_url}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                link_url: e.target.value,
                                            })
                                        }
                                        className="input-field pl-9"
                                        placeholder="https://..."
                                    />
                                    <ExternalLink className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Link opcional para o produto em alguma loja
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex justify-end items-center gap-3 mt-8 pt-6 border-t border-gray-100">
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
                            {submitting ? "Salvando..." : item ? "Salvar Alterações" : "Criar Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemModal;
