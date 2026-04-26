import { Check, Loader2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mensagensApi } from "../../services/api";
import type { Mensagem } from "../../types";

type FiltroStatus = "todas" | "pendentes" | "aprovadas";

const AdminMensagens = () => {
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const [filtro, setFiltro] = useState<FiltroStatus>("todas");

    const loadMensagens = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await mensagensApi.getMensagens();
            setMensagens(data);
        } catch {
            setError("Erro ao carregar mensagens");
            toast.error("Não foi possível carregar as mensagens");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMensagens();
    }, [loadMensagens]);

    const handleAprovar = async (id: number) => {
        try {
            setLoadingId(id);
            const updated = await mensagensApi.aprovarMensagem(id);
            setMensagens((prev) => prev.map((m) => (m.id === id ? updated : m)));
            toast.success("Mensagem aprovada com sucesso!");
        } catch {
            toast.error("Erro ao aprovar mensagem");
        } finally {
            setLoadingId(null);
        }
    };

    const handleDeletar = async (id: number) => {
        if (!confirm("Tem certeza que deseja deletar esta mensagem?")) return;
        try {
            setLoadingId(id);
            await mensagensApi.deleteMensagem(id);
            setMensagens((prev) => prev.filter((m) => m.id !== id));
            toast.success("Mensagem deletada com sucesso!");
        } catch {
            toast.error("Erro ao deletar mensagem");
        } finally {
            setLoadingId(null);
        }
    };

    const mensagensFiltradas = mensagens.filter((m) => {
        if (filtro === "pendentes") return !m.aprovada;
        if (filtro === "aprovadas") return m.aprovada;
        return true;
    });

    const contagem = {
        todas: mensagens.length,
        pendentes: mensagens.filter((m) => !m.aprovada).length,
        aprovadas: mensagens.filter((m) => m.aprovada).length,
    };

    const filtros: { key: FiltroStatus; label: string }[] = [
        { key: "todas", label: `Todas (${contagem.todas})` },
        { key: "pendentes", label: `Pendentes (${contagem.pendentes})` },
        { key: "aprovadas", label: `Aprovadas (${contagem.aprovadas})` },
    ];

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Mensagens</h2>

            {/* Filtro de status */}
            {!loading && !error && (
                <div className="flex gap-2 mb-6">
                    {filtros.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFiltro(key)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                filtro === key
                                    ? "bg-primary-500 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-24 bg-gray-100 rounded-lg" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : mensagensFiltradas.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                    Nenhuma mensagem {filtro !== "todas" ? `${filtro}` : "encontrada"}.
                </p>
            ) : (
                <div className="space-y-4">
                    {mensagensFiltradas.map((mensagem) => (
                        <div key={mensagem.id} className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold">{mensagem.nome}</h3>
                                        {mensagem.aprovada ? (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                Aprovada
                                            </span>
                                        ) : (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                                                Pendente
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 break-words">{mensagem.mensagem}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {!mensagem.aprovada && (
                                        <button
                                            onClick={() => handleAprovar(mensagem.id)}
                                            disabled={loadingId === mensagem.id}
                                            className="btn-success disabled:opacity-60 disabled:cursor-not-allowed"
                                            aria-label="Aprovar mensagem"
                                        >
                                            {loadingId === mensagem.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <Check className="w-5 h-5" />
                                            )}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDeletar(mensagem.id)}
                                        disabled={loadingId === mensagem.id}
                                        className="btn-danger disabled:opacity-60 disabled:cursor-not-allowed"
                                        aria-label="Deletar mensagem"
                                    >
                                        {loadingId === mensagem.id ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMensagens;
