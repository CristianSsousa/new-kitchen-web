import { Heart, Minus, Plus, Users, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { confirmacoesApi } from "../services/api";
import { useConvidado } from "../contexts/ConvidadoContext";

const Confirmacao = () => {
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const { convidado, stats, refreshStats } = useConvidado();
    const [formData, setFormData] = useState({
        quantidade_adultos: 1,
        quantidade_criancas: 0,
    });

    // Verificar se o convidado já tem confirmação
    const jaTemConfirmacao = stats?.tem_confirmacao;

    const handleCancelar = async () => {
        if (!convidado) return;
        try {
            setCancelling(true);
            await confirmacoesApi.cancelarConfirmacao(convidado.codigo_unico);
            toast.success("Confirmação cancelada.");
            await refreshStats();
        } catch {
            toast.error("Erro ao cancelar confirmação. Tente novamente.");
        } finally {
            setCancelling(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const requestData = {
                ...formData,
                codigo_convidado: convidado?.codigo_unico,
            };
            await confirmacoesApi.createConfirmacao(requestData);
            toast.success("Que alegria! Sua presença foi confirmada! 🎉");
            
            // Atualizar estatísticas se for convidado logado
            if (convidado) {
                await refreshStats();
            } else {
                setFormData({
                    quantidade_adultos: 1,
                    quantidade_criancas: 0,
                });
            }
        } catch (err) {
            toast.error("Erro ao enviar confirmação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary-50/30">
            <div className="max-w-2xl mx-auto">
                {/* Cabeçalho */}
                <div className="text-center mb-12">
                    <div className="inline-block">
                        <h1 className="title-romantic mb-4 relative">
                            Confirmação de Presença
                            <Heart className="absolute -right-8 -top-6 h-6 w-6 text-romantic-gold/30 transform rotate-12" />
                        </h1>
                    </div>
                    {convidado ? (
                        <p className="subtitle-romantic">
                            Olá, {convidado.nome}! {jaTemConfirmacao ? "Sua presença já foi confirmada! 🎉" : "Confirme sua presença! 💝"}
                        </p>
                    ) : (
                        <p className="subtitle-romantic">
                            Sua presença é muito importante para nós! 💝
                        </p>
                    )}
                </div>

                {/* Formulário */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-4 sm:p-8">
                        {jaTemConfirmacao && stats?.confirmacao ? (
                            <div className="text-center space-y-4">
                                <div className="bg-green-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-green-800 mb-4">
                                        ✅ Presença Confirmada!
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-green-600 font-medium">Adultos:</span>
                                            <p className="text-green-800 text-xl font-bold">
                                                {stats.confirmacao.quantidade_adultos}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-green-600 font-medium">Crianças:</span>
                                            <p className="text-green-800 text-xl font-bold">
                                                {stats.confirmacao.quantidade_criancas}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-green-200">
                                        <p className="text-green-700">
                                            <strong>Total: {stats.confirmacao.quantidade_adultos + stats.confirmacao.quantidade_criancas} pessoas</strong>
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-600">
                                    Mal podemos esperar para te ver no nosso evento! 💕
                                </p>
                                <button
                                    onClick={handleCancelar}
                                    disabled={cancelling}
                                    className="mt-2 flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {cancelling ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent mr-2" />
                                    ) : (
                                        <X className="h-4 w-4 mr-2" />
                                    )}
                                    {cancelling ? "Cancelando..." : "Cancelar confirmação"}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Quantidade de Convidados */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Quantidade de Adultos */}
                                <div>
                                    <label
                                        htmlFor="quantidade_adultos"
                                        className="form-label"
                                    >
                                        Adultos
                                        <span className="text-romantic-gold ml-1">
                                            *
                                        </span>
                                    </label>
                                    <div className="mt-2 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    quantidade_adultos:
                                                        Math.max(
                                                            1,
                                                            prev.quantidade_adultos -
                                                                1
                                                        ),
                                                }))
                                            }
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                            <Minus className="h-4 w-4 text-gray-600" />
                                        </button>
                                        <input
                                            type="number"
                                            id="quantidade_adultos"
                                            name="quantidade_adultos"
                                            min="1"
                                            required
                                            value={formData.quantidade_adultos}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    quantidade_adultos:
                                                        Math.max(
                                                            1,
                                                            parseInt(
                                                                e.target.value
                                                            ) || 1
                                                        ),
                                                })
                                            }
                                            className="w-16 mx-3 text-center input-field"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    quantidade_adultos:
                                                        prev.quantidade_adultos +
                                                        1,
                                                }))
                                            }
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                            <Plus className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Quantidade de Crianças */}
                                <div>
                                    <label
                                        htmlFor="quantidade_criancas"
                                        className="form-label"
                                    >
                                        Crianças
                                    </label>
                                    <div className="mt-2 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    quantidade_criancas:
                                                        Math.max(
                                                            0,
                                                            prev.quantidade_criancas -
                                                                1
                                                        ),
                                                }))
                                            }
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                            <Minus className="h-4 w-4 text-gray-600" />
                                        </button>
                                        <input
                                            type="number"
                                            id="quantidade_criancas"
                                            name="quantidade_criancas"
                                            min="0"
                                            value={formData.quantidade_criancas}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    quantidade_criancas:
                                                        Math.max(
                                                            0,
                                                            parseInt(
                                                                e.target.value
                                                            ) || 0
                                                        ),
                                                })
                                            }
                                            className="w-16 mx-3 text-center input-field"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    quantidade_criancas:
                                                        prev.quantidade_criancas +
                                                        1,
                                                }))
                                            }
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        >
                                            <Plus className="h-4 w-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Total de Convidados */}
                            <div className="bg-primary-50/50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Total de Convidados
                                </p>
                                <p className="text-2xl font-serif font-semibold text-primary-700 mt-1">
                                    {formData.quantidade_adultos +
                                        formData.quantidade_criancas}
                                </p>
                            </div>

                            {/* Botão de Enviar */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                    ) : (
                                        <>
                                            <Users className="h-5 w-5 mr-2" />
                                            Confirmar Presença
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmacao;
