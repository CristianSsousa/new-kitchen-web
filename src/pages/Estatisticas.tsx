import { BarChart, Gift, MessageCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { statsApi } from "../services/api";
import type { Stats } from "../types";

const Estatisticas = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar estatísticas
    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await statsApi.getStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar estatísticas");
            toast.error("Não foi possível carregar as estatísticas");
        } finally {
            setLoading(false);
        }
    };

    // Carregar estatísticas na inicialização
    useEffect(() => {
        loadStats();
    }, []);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho */}
                <div className="text-center mb-12">
                    <h1 className="title-romantic mb-4">Estatísticas</h1>
                    <p className="subtitle-romantic">
                        Acompanhe o progresso do nosso chá 📊
                    </p>
                </div>

                {loading ? (
                    // Loading State
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="card animate-pulse h-32" />
                        ))}
                    </div>
                ) : error ? (
                    // Error State
                    <div className="text-center text-red-500">{error}</div>
                ) : (
                    <>
                        {/* Cards de Estatísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {/* Progresso da Lista */}
                            <div className="card p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Progresso da Lista
                                        </p>
                                        <h3 className="text-2xl font-bold text-primary-600 mt-2">
                                            {stats?.porcentagem_concluida.toFixed(
                                                1
                                            )}
                                            %
                                        </h3>
                                    </div>
                                    <div className="p-2 bg-primary-100 rounded-lg">
                                        <BarChart className="h-6 w-6 text-primary-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-primary-500 h-2 rounded-full"
                                            style={{
                                                width: `${stats?.porcentagem_concluida}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Total de Presentes */}
                            <div className="card p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Presentes
                                        </p>
                                        <h3 className="text-2xl font-bold text-romantic-gold mt-2">
                                            {stats?.itens_resgatados} /{" "}
                                            {stats?.total_itens}
                                        </h3>
                                    </div>
                                    <div className="p-2 bg-romantic-gold/20 rounded-lg">
                                        <Gift className="h-6 w-6 text-romantic-gold" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {stats?.itens_resgatados} presentes
                                    resgatados
                                </p>
                            </div>

                            {/* Convidados */}
                            <div className="card p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Convidados
                                        </p>
                                        <h3 className="text-2xl font-bold text-secondary-600 mt-2">
                                            {stats?.total_convidados}
                                        </h3>
                                    </div>
                                    <div className="p-2 bg-secondary-100 rounded-lg">
                                        <Users className="h-6 w-6 text-secondary-600" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    confirmações recebidas
                                </p>
                            </div>

                            {/* Mensagens */}
                            <div className="card p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Mensagens
                                        </p>
                                        <h3 className="text-2xl font-bold text-primary-600 mt-2">
                                            {stats?.total_mensagens}
                                        </h3>
                                    </div>
                                    <div className="p-2 bg-primary-100 rounded-lg">
                                        <MessageCircle className="h-6 w-6 text-primary-600" />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    mensagens de carinho
                                </p>
                            </div>
                        </div>

                        {/* Mensagem de Agradecimento */}
                        <div className="card-romantic p-8 text-center">
                            <h2 className="font-serif text-2xl font-bold text-primary-600 mb-4">
                                Gratidão! 💝
                            </h2>
                            <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
                                Cada presente escolhido, cada mensagem enviada e
                                cada presença confirmada nos enche de alegria!
                                Obrigado por fazer parte deste momento tão
                                especial em nossas vidas.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Estatisticas;
