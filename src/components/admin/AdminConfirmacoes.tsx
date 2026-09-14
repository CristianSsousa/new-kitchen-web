import { Baby, Edit2, Loader2, Trash2, UserCheck, UserX, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { confirmacoesApi } from "../../services/api";
import type { Confirmacao } from "../../types";
import ConfirmDialog from "../ConfirmDialog";
import ConfirmacaoModal, { type ConfirmacaoFormData } from "../ConfirmacaoModal";
import { useConfirmDialog } from "../../hooks/useConfirmDialog";

type FiltroStatus = "todas" | "confirmados" | "nao_vao";

const AdminConfirmacoes = () => {
    const [confirmacoes, setConfirmacoes] = useState<Confirmacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedConfirmacao, setSelectedConfirmacao] = useState<Confirmacao | undefined>(undefined);
    const [filtro, setFiltro] = useState<FiltroStatus>("todas");
    const deleteConfirm = useConfirmDialog<Confirmacao>();

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

    const handleDeletar = async () => {
        const confirmacao = deleteConfirm.target;
        if (!confirmacao) return;
        try {
            setDeletingId(confirmacao.id);
            await confirmacoesApi.deleteConfirmacao(confirmacao.id);
            toast.success("Confirmação deletada!");
            setConfirmacoes((prev) => prev.filter((c) => c.id !== confirmacao.id));
        } catch {
            toast.error("Erro ao deletar confirmação");
        } finally {
            setDeletingId(null);
            deleteConfirm.cancel();
        }
    };

    const openEdit = (confirmacao: Confirmacao) => {
        setSelectedConfirmacao(confirmacao);
        setIsModalOpen(true);
    };

    const handleEditar = async (data: ConfirmacaoFormData) => {
        if (!selectedConfirmacao) return;
        try {
            const updated = await confirmacoesApi.updateConfirmacao(selectedConfirmacao.id, data);
            setConfirmacoes((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            toast.success("Confirmação atualizada com sucesso!");
            setIsModalOpen(false);
            setSelectedConfirmacao(undefined);
        } catch {
            toast.error("Erro ao atualizar confirmação");
        }
    };

    const totalAdultos = confirmacoes.reduce((s, c) => s + c.quantidade_adultos, 0);
    const totalCriancas = confirmacoes.reduce((s, c) => s + c.quantidade_criancas, 0);
    const totalPessoas = totalAdultos + totalCriancas;
    const totalConfirmados = confirmacoes.filter((c) => c.attending).length;
    const totalNaoVao = confirmacoes.filter((c) => !c.attending).length;

    const confirmacoesFiltradas = confirmacoes.filter((c) => {
        if (filtro === "confirmados") return c.attending;
        if (filtro === "nao_vao") return !c.attending;
        return true;
    });

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
                                <p className="text-xs text-gray-400">Confirmados</p>
                                <p className="text-base font-bold text-gray-800 leading-tight">{totalConfirmados}</p>
                            </div>
                        </div>
                        <div className="card px-4 py-2.5 flex items-center gap-2.5">
                            <div className="p-1.5 rounded-full bg-red-100">
                                <UserX className="w-3.5 h-3.5 text-red-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Não vão</p>
                                <p className="text-base font-bold text-gray-800 leading-tight">{totalNaoVao}</p>
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

            {/* Filtro de status */}
            {!loading && !error && confirmacoes.length > 0 && (
                <div className="flex gap-2">
                    {(
                        [
                            { key: "todas", label: `Todas (${confirmacoes.length})` },
                            { key: "confirmados", label: `Vão (${totalConfirmados})` },
                            { key: "nao_vao", label: `Não vão (${totalNaoVao})` },
                        ] as const
                    ).map(({ key, label }) => (
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
            ) : confirmacoesFiltradas.length === 0 ? (
                <div className="text-center py-16">
                    <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Nenhuma confirmação nesse filtro</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {confirmacoesFiltradas.map((c) => (
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
                                {c.attending ? (
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
                                ) : (
                                    <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                                        <UserX className="w-3 h-3" />
                                        Não vai
                                    </span>
                                )}
                            </div>

                            {/* Total */}
                            {c.attending && (
                                <div className="flex-shrink-0 text-center hidden sm:block">
                                    <p className="text-xl font-bold text-primary-600">
                                        {c.quantidade_adultos + c.quantidade_criancas}
                                    </p>
                                    <p className="text-xs text-gray-400">pessoa{c.quantidade_adultos + c.quantidade_criancas !== 1 ? "s" : ""}</p>
                                </div>
                            )}

                            {/* Editar */}
                            <button
                                onClick={() => openEdit(c)}
                                disabled={deletingId === c.id}
                                className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-500 transition-colors disabled:opacity-50"
                                aria-label="Editar confirmação"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Deletar */}
                            <button
                                onClick={() => deleteConfirm.request(c)}
                                disabled={deletingId === c.id}
                                className="flex-shrink-0 p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                                aria-label="Deletar confirmação"
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

            <ConfirmacaoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedConfirmacao(undefined);
                }}
                onSubmit={handleEditar}
                confirmacao={selectedConfirmacao}
            />

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Deletar confirmação?"
                message={`Tem certeza que deseja deletar a confirmação de ${deleteConfirm.target?.nome}? Essa ação não pode ser desfeita.`}
                confirmLabel="Deletar"
                loading={deletingId === deleteConfirm.target?.id}
                onConfirm={handleDeletar}
                onCancel={deleteConfirm.cancel}
            />
        </div>
    );
};

export default AdminConfirmacoes;
