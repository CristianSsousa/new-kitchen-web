import { Baby, CheckCircle2, Heart, Loader2, Minus, Plus, Users, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { confirmacoesApi } from "../services/api";
import { useConvidado } from "../contexts/ConvidadoContext";

const Counter = ({
    value,
    min,
    onChange,
}: {
    value: number;
    min: number;
    onChange: (v: number) => void;
}) => (
    <div className="flex items-center gap-3">
        <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
            <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center text-2xl font-bold text-gray-800 tabular-nums">
            {value}
        </span>
        <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
        >
            <Plus className="w-4 h-4" />
        </button>
    </div>
);

const Confirmacao = () => {
    const [loading, setLoading] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const { convidado, stats, refreshStats } = useConvidado();
    const [formData, setFormData] = useState({
        quantidade_adultos: 1,
        quantidade_criancas: 0,
    });

    const jaTemConfirmacao = stats?.tem_confirmacao;
    const total = formData.quantidade_adultos + formData.quantidade_criancas;

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
            await confirmacoesApi.createConfirmacao({
                ...formData,
                codigo_convidado: convidado?.codigo_unico,
            });
            toast.success("Que alegria! Sua presença foi confirmada! 🎉");
            if (convidado) {
                await refreshStats();
            } else {
                setFormData({ quantidade_adultos: 1, quantidade_criancas: 0 });
            }
        } catch {
            toast.error("Erro ao enviar confirmação. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg mx-auto">

                {/* Cabeçalho */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 shadow-lg mb-4">
                        <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="title-romantic mb-2">Confirmação de Presença</h1>
                    <p className="text-gray-500 text-sm">
                        {convidado
                            ? jaTemConfirmacao
                                ? `Olá, ${convidado.nome.split(" ")[0]}! Sua presença já está confirmada 🎉`
                                : `Olá, ${convidado.nome.split(" ")[0]}! Confirme sua presença abaixo 💕`
                            : "Sua presença é muito importante para nós 💝"}
                    </p>
                </div>

                {jaTemConfirmacao && stats?.confirmacao ? (
                    /* ── Estado: já confirmado ── */
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Banner verde */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5 text-white text-center">
                            <CheckCircle2 className="w-10 h-10 mx-auto mb-2 opacity-90" />
                            <p className="font-bold text-lg">Presença Confirmada!</p>
                            <p className="text-green-100 text-sm mt-0.5">
                                Mal podemos esperar para te ver 💕
                            </p>
                        </div>

                        {/* Resumo */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-1">
                                        <Users className="w-3.5 h-3.5" />
                                        Adultos
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {stats.confirmacao.quantidade_adultos}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-1">
                                        <Baby className="w-3.5 h-3.5" />
                                        Crianças
                                    </div>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {stats.confirmacao.quantidade_criancas}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-primary-50 rounded-xl px-4 py-3 flex items-center justify-between">
                                <span className="text-sm font-medium text-primary-700">Total de pessoas</span>
                                <span className="text-2xl font-bold text-primary-700">
                                    {stats.confirmacao.quantidade_adultos + stats.confirmacao.quantidade_criancas}
                                </span>
                            </div>

                            <button
                                onClick={handleCancelar}
                                disabled={cancelling}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-red-500 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelling ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <X className="w-4 h-4" />
                                )}
                                {cancelling ? "Cancelando..." : "Cancelar confirmação"}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Estado: formulário ── */
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Faixa decorativa */}
                            <div className="h-1.5 bg-gradient-to-r from-primary-400 via-secondary-400 to-romantic-gold" />

                            <div className="p-6 sm:p-8 space-y-8">
                                {/* Adultos */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Users className="w-5 h-5 text-primary-500" />
                                            <span className="font-semibold text-gray-800">Adultos</span>
                                            <span className="text-xs text-primary-400 font-medium">mín. 1</span>
                                        </div>
                                        <p className="text-xs text-gray-400 ml-7">Maiores de 12 anos</p>
                                    </div>
                                    <Counter
                                        value={formData.quantidade_adultos}
                                        min={1}
                                        onChange={(v) => setFormData((p) => ({ ...p, quantidade_adultos: v }))}
                                    />
                                </div>

                                <div className="border-t border-gray-50" />

                                {/* Crianças */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <Baby className="w-5 h-5 text-secondary-500" />
                                            <span className="font-semibold text-gray-800">Crianças</span>
                                            <span className="text-xs text-gray-400 font-medium">opcional</span>
                                        </div>
                                        <p className="text-xs text-gray-400 ml-7">Até 12 anos</p>
                                    </div>
                                    <Counter
                                        value={formData.quantidade_criancas}
                                        min={0}
                                        onChange={(v) => setFormData((p) => ({ ...p, quantidade_criancas: v }))}
                                    />
                                </div>

                                {/* Total */}
                                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl px-5 py-4 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Total de pessoas</span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl font-bold text-primary-600 tabular-nums">
                                            {total}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {total === 1 ? "pessoa" : "pessoas"}
                                        </span>
                                    </div>
                                </div>

                                {/* Botão */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Heart className="w-5 h-5" />
                                    )}
                                    {loading ? "Confirmando..." : "Confirmar Presença"}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Confirmacao;
