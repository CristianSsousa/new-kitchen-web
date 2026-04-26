import { Gift, Loader2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Item } from "../types";
import { formatCurrency } from "../utils/format";

interface Props {
    item: Item | null;
    nomeConvidado?: string;
    onConfirm: (nome: string) => Promise<void>;
    onClose: () => void;
}

const ReservaModal = ({ item, nomeConvidado, onConfirm, onClose }: Props) => {
    const [nome, setNome] = useState(nomeConvidado ?? "");
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (item && !nomeConvidado) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [item, nomeConvidado]);

    if (!item) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome.trim()) return;
        setLoading(true);
        await onConfirm(nome.trim());
        setLoading(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                {/* Imagem */}
                <div className="relative h-48">
                    <img
                        src={item.imagem_url}
                        alt={item.nome}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-4 right-4">
                        <p className="font-serif text-white font-bold text-lg leading-tight line-clamp-2">
                            {item.nome}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-primary-500 text-white text-sm font-bold">
                            {formatCurrency(item.preco)}
                        </span>
                    </div>
                </div>

                {/* Corpo */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-1">
                            Reservar este presente 🎁
                        </h2>
                        <p className="text-sm text-gray-500">
                            {nomeConvidado
                                ? "Confirme a reserva no seu nome:"
                                : "Digite seu nome para reservar este presente:"}
                        </p>
                    </div>

                    {nomeConvidado ? (
                        /* Convidado logado — mostra o nome como badge */
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-50 border border-primary-100">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {nomeConvidado.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium text-primary-800">{nomeConvidado}</p>
                                <p className="text-xs text-primary-500">Reservando em seu nome</p>
                            </div>
                        </div>
                    ) : (
                        /* Visitante — campo para digitar o nome */
                        <input
                            ref={inputRef}
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Seu nome completo"
                            className="input-field"
                            required
                            maxLength={80}
                        />
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !nome.trim()}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium hover:from-primary-600 hover:to-primary-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Gift className="w-4 h-4" />
                            )}
                            {loading ? "Reservando..." : "Confirmar Reserva"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservaModal;
