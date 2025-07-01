import { Heart, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mensagensApi } from "../services/api";
import type { Mensagem } from "../types";

// Função para gerar posições e tamanhos aleatórios para as mensagens
const getRandomStyles = () => {
    const positions = [
        "-rotate-2 translate-y-2",
        "rotate-1",
        "-rotate-1 -translate-y-2",
        "rotate-2 translate-y-1",
        "-rotate-3 translate-x-1",
        "rotate-1 -translate-x-1",
    ];

    const sizes = [
        "min-h-[200px]", // Tamanho padrão
        "min-h-[250px]", // Um pouco maior
        "min-h-[300px]", // Grande
        "min-h-[180px]", // Um pouco menor
    ];

    const widths = [
        "", // Largura padrão
        "md:w-[120%]", // 20% mais largo
        "md:w-[110%]", // 10% mais largo
        "md:w-[90%]", // 10% mais estreito
    ];

    return {
        position: positions[Math.floor(Math.random() * positions.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        width: widths[Math.floor(Math.random() * widths.length)],
    };
};

const Mensagens = () => {
    const [mensagens, setMensagens] = useState<
        (Mensagem & { styles?: ReturnType<typeof getRandomStyles> })[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        nome: "",
        mensagem: "",
    });

    // Carregar mensagens
    const loadMensagens = async () => {
        try {
            setLoading(true);
            const data = await mensagensApi.getMensagensAprovadas();
            const mensagensComEstilos = data.map((msg) => ({
                ...msg,
                styles: getRandomStyles(),
            }));
            setMensagens(mensagensComEstilos);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar mensagens");
            toast.error("Não foi possível carregar as mensagens");
        } finally {
            setLoading(false);
        }
    };

    // Enviar mensagem
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nome || !formData.mensagem) {
            toast.error("Por favor, preencha todos os campos");
            return;
        }

        try {
            await mensagensApi.createMensagem(formData);
            toast.success("Mensagem enviada com sucesso! Aguarde aprovação 💕");
            setFormData({ nome: "", mensagem: "" });
            loadMensagens();
        } catch (err) {
            toast.error("Erro ao enviar mensagem. Tente novamente.");
        }
    };

    // Carregar mensagens na inicialização
    useEffect(() => {
        loadMensagens();
    }, []);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary-50/30">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho */}
                <div className="text-center mb-16">
                    <div className="inline-block">
                        <h1 className="title-romantic mb-4 relative">
                            Mural de Mensagens
                            <Heart className="absolute -right-8 -top-6 h-6 w-6 text-romantic-gold/30 transform rotate-12" />
                        </h1>
                    </div>
                    <p className="subtitle-romantic">
                        Deixe seu carinho e votos de felicidade 💝
                    </p>
                </div>

                {/* Formulário de Mensagem */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-16">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label htmlFor="nome" className="form-label">
                                    Seu Nome
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            nome: e.target.value,
                                        })
                                    }
                                    className="input-field mt-2"
                                    placeholder="Como devemos te chamar?"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="mensagem"
                                    className="form-label"
                                >
                                    Sua Mensagem
                                </label>
                                <textarea
                                    id="mensagem"
                                    name="mensagem"
                                    rows={4}
                                    value={formData.mensagem}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            mensagem: e.target.value,
                                        })
                                    }
                                    className="input-field mt-2 resize-none"
                                    placeholder="Deixe aqui seu carinho e votos de felicidade..."
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 px-5 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Enviar Mensagem
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Lista de Mensagens */}
                <div>
                    {loading ? (
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div
                                    key={n}
                                    className="break-inside-avoid mb-6"
                                >
                                    <div
                                        className={`h-[${
                                            Math.floor(Math.random() * 100) +
                                            200
                                        }px] bg-gray-100 rounded-xl animate-pulse`}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-12 bg-red-50 rounded-xl">
                            <div className="max-w-md mx-auto">
                                <p className="text-lg font-medium">{error}</p>
                                <p className="mt-2 text-sm text-red-400">
                                    Por favor, tente novamente mais tarde.
                                </p>
                            </div>
                        </div>
                    ) : mensagens.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-xl">
                            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                            <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">
                                Nenhuma mensagem ainda
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Seja o primeiro a deixar uma mensagem de carinho
                                para o casal!
                            </p>
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
                            {mensagens.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`break-inside-avoid mb-6 ${msg.styles?.width}`}
                                >
                                    <div
                                        className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 transform ${msg.styles?.position} ${msg.styles?.size} flex flex-col`}
                                    >
                                        {/* Conteúdo da Mensagem */}
                                        <div className="relative flex-grow">
                                            <div className="absolute -left-1 top-0 text-3xl text-romantic-gold/20">
                                                "
                                            </div>
                                            <p className="text-gray-700 text-sm whitespace-pre-line pl-4 italic mb-4">
                                                {msg.mensagem}
                                            </p>
                                            <div className="absolute -bottom-2 right-0 text-3xl text-romantic-gold/20 transform rotate-180">
                                                "
                                            </div>
                                        </div>

                                        {/* Autor e Data */}
                                        <div className="mt-auto pt-4 border-t border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-romantic-gold to-primary-300 flex items-center justify-center text-white font-bold text-sm">
                                                        {msg.nome
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {msg.nome}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {new Date(
                                                                msg.criada_em
                                                            ).toLocaleDateString(
                                                                "pt-BR",
                                                                {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                }
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Heart className="h-4 w-4 text-romantic-gold opacity-40" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Mensagens;
