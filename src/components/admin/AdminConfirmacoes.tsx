import { Baby, Loader2, Trash2, UserCheck, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { confirmacoesApi } from "../../services/api";
import type { Confirmacao } from "../../types";

const AdminConfirmacoes = () => {
    const [confirmacoes, setConfirmacoes] = useState<Confirmacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadConfirmacoes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await confirmacoesApi.getConfirmacoes();
            setConfirmacoes(data);
        } catch {
            setError("Erro ao carregar confirmações");
            toast.error("Não foi possível carregar as confirmações");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadConfirmacoes();
    }, [loadConfirmacoes]);

    const handleDeletar = async (id: number) => {
        if (!confirm("Tem certeza que deseja deletar esta confirmação?")) return;
        try {
            setDeletingId(id);
            await confirmacoesApi.deleteConfirmacao(id);
            toast.success("Confirmação deletada!");
            setConfirmacoes((prev) => prev.filter((c) => c.id !== id));
        } catch {
            toast.error("Erro ao deletar confirmação");
        } finally {
            setDeletingId(null);
        }
    };

    const totalAdultos = confirmacoes.reduce((s, c) => s + c.quantidade_adultos, 0);
    const totalCriancas = confirmacoes.reduce((s, c) => s + c.quantidade_criancas, 0);
    const totalPessoas = totalAdultos + totalCriancas;

    const getInitials = (nome: string) =>
        nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

    return (
        <div className="space-y-6">
            {/* Cabeçalho + resumo */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-bold">Confirmações</h2>

                {!loading && confirmacoes.length > 0 && (
                    <div className="flex gap-3 flex-wrap">
                        <div className="card px-4 py-2.5 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-full bg-primary-100">
                                <UserCheck className="w-3.5 h-3.5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Confirmações</p>
                                <p className="text-base font-bold text-gray-800 leading-tight">{confirmacoes.length}</p>
                            </div>
                        </div>
                        <div className="card px-4 py-2.5 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-full bg-blue-100">
                                <Users className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Adultos</p>
                                <p className="text-base font-bold text-gray-800 leading-tight">{totalAdultos}</p>
                            </div>
                        </div>
                        <div className="card px-4 py-2.5 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-full bg-secondary-100">
                                <Baby className="w-3.5 h-3.5 text-secondary-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Crianças</p>
                                <p className="text-base font-bold text-gray-800 leading-tight">{totalCriancas}</p>
                            </div>
                        </div>
                        <div className="card px-4 py-2.5 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-full bg-green-100">
                                <Users className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Total</p>
                                <p className="text-base font-bold text-green-700 leading-tight">{totalPessoas}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lista */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : confirmacoes.length === 0 ? (
                <div className="text-center py-16">
                    <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhuma confirmação ainda</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {confirmacoes.map((c) => (
                        <div
                            key={c.id}
                            className="card p-4 flex items-center gap-4"
                        >
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-sm font-bold shadow">
                                {getInitials(c.nome)}
                            </div>

                            {/* Nome */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 truncate">{c.nome}</p>
                                <div className="flex items-center gap-3 mt-0.5">
                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                        <Users className="w-3 h-3" />
                                        {c.quantidade_adultos} adulto{c.quantidade_adultos !== 1 ? "s" : ""}
                                    </span>
                                    {c.quantidade_criancas > 0 && (
                                        <span className="flex items-center gap-1 text-xs text-gray-500">
                                            <Baby className="w-3 h-3" />
                                            {c.quantidade_criancas} criança{c.quantidade_criancas !== 1 ? "s" : ""}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex-shrink-0 text-center hidden sm:block">
                                <p className="text-xl font-bold text-primary-600">
                                    {c.quantidade_adultos + c.quantidade_criancas}
                                </p>
                                <p className="text-xs text-gray-400">pessoa{c.quantidade_adultos + c.quantidade_criancas !== 1 ? "s" : ""}</p>
                            </div>

                            {/* Deletar */}
                            <button
                                onClick={() => handleDeletar(c.id)}
                                disabled={deletingId === c.id}
                                className="flex-shrink-0 p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                            >
                                {deletingId === c.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminConfirmacoes;
