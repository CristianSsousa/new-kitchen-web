import { Heart, Minus, Plus, Users } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { confirmacoesApi } from "../services/api";

const Confirmacao = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: "",
        quantidade_adultos: 1,
        quantidade_criancas: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nome.trim()) {
            toast.error("Por favor, preencha seu nome");
            return;
        }

        try {
            setLoading(true);
            await confirmacoesApi.createConfirmacao(formData);
            toast.success("Que alegria! Sua presença foi confirmada! 🎉");
            setFormData({
                nome: "",
                quantidade_adultos: 1,
                quantidade_criancas: 0,
            });
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
                    <p className="subtitle-romantic">
                        Sua presença é muito importante para nós! 💝
                    </p>
                </div>

                {/* Formulário */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Nome */}
                            <div>
                                <label htmlFor="nome" className="form-label">
                                    Seu Nome
                                    <span className="text-romantic-gold ml-1">
                                        *
                                    </span>
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        id="nome"
                                        name="nome"
                                        required
                                        value={formData.nome}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nome: e.target.value,
                                            })
                                        }
                                        className="input-field"
                                        placeholder="Como devemos te chamar?"
                                    />
                                </div>
                            </div>

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmacao;
