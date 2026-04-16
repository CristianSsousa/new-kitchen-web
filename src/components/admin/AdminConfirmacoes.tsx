import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { confirmacoesApi } from "../../services/api";
import type { Confirmacao } from "../../types";

const AdminConfirmacoes = () => {
    const [confirmacoes, setConfirmacoes] = useState<Confirmacao[]>([]);
    const [loading, setLoading] = useState(true);
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
            await confirmacoesApi.deleteConfirmacao(id);
            toast.success("Confirmação deletada com sucesso!");
            loadConfirmacoes();
        } catch {
            toast.error("Erro ao deletar confirmação");
        }
    };

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Confirmações</h2>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-24 bg-gray-100 rounded-lg" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div className="space-y-4">
                    {confirmacoes.map((confirmacao) => (
                        <div key={confirmacao.id} className="p-4 sm:p-6 bg-white rounded-lg shadow-sm">
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="mb-2 font-bold">{confirmacao.nome}</h3>
                                    <p className="text-gray-600">
                                        {confirmacao.quantidade_adultos} adultos e{" "}
                                        {confirmacao.quantidade_criancas} crianças
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDeletar(confirmacao.id)}
                                    className="btn-danger shrink-0"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminConfirmacoes;
