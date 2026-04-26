import { BarChart, Calendar, Gift, MessageCircle, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { statsApi } from "../../services/api";
import type { EstatisticasDetalhadas } from "../../types";
import { formatCurrency } from "../../utils/format";

const AdminEstatisticas = () => {
    const [stats, setStats] = useState<EstatisticasDetalhadas | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await statsApi.getEstatisticasDetalhadas();
            setStats(data);
        } catch {
            setError("Erro ao carregar estatísticas");
            toast.error("Não foi possível carregar os dados");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Estatísticas</h2>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-24 bg-gray-100 rounded-lg" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Total de Itens</p>
                                <h3 className="text-2xl font-bold">{stats?.total_itens}</h3>
                            </div>
                            <Gift className="w-8 h-8 text-primary-500" />
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Total de Mensagens</p>
                                <h3 className="text-2xl font-bold">{stats?.total_mensagens}</h3>
                            </div>
                            <MessageCircle className="w-8 h-8 text-primary-500" />
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Total de Confirmações</p>
                                <h3 className="text-2xl font-bold">{stats?.total_confirmacoes}</h3>
                            </div>
                            <Users className="w-8 h-8 text-primary-500" />
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Total de Convidados</p>
                                <h3 className="text-2xl font-bold">{stats?.total_convidados}</h3>
                            </div>
                            <Calendar className="w-8 h-8 text-primary-500" />
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Valor Total dos Itens</p>
                                <h3 className="text-2xl font-bold">
                                    {formatCurrency(stats?.valor_total_itens || 0)}
                                </h3>
                            </div>
                            <BarChart className="w-8 h-8 text-primary-500" />
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Valor Reservado</p>
                                <h3 className="text-2xl font-bold">
                                    {formatCurrency(stats?.valor_resgatado_itens || 0)}
                                </h3>
                            </div>
                            <Gift className="w-8 h-8 text-secondary-500" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEstatisticas;
