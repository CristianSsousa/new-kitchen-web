import { Heart, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { mensagensApi } from "../services/api";
import type { Mensagem } from "../types";
import { useConvidado } from "../contexts/ConvidadoContext";

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
    const { convidado } = useConvidado();

    const [formData, setFormData] = useState({
        nome: convidado?.nome || "",
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

        if ((!formData.nome && !convidado?.nome) || !formData.mensagem) {
            toast.error("Por favor, preencha todos os campos");
            return;
        }

        try {
            await mensagensApi.createMensagem({
                nome: convidado?.nome || formData.nome,
                mensagem: formData.mensagem,
            });
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
        <div className="px-4 py-12 min-h-screen bg-gradient-to-b from-white sm:px-6 lg:px-8 to-primary-50/30">
            <div className="mx-auto max-w-7xl">
                {/* Cabeçalho */}
                <div className="mb-16 text-center">
                    <div className="inline-block">
                        <h1 className="relative mb-4 title-romantic">
                            Mural de Mensagens
                            <Heart className="absolute -top-6 -right-8 w-6 h-6 transform rotate-12 text-romantic-gold/30" />
                        </h1>
                    </div>
                    <p className="subtitle-romantic">
                        Deixe seu carinho e votos de felicidade 💝
                    </p>
                </div>

                {/* Formulário de Mensagem */}
                <div className="mx-auto max-w-2xl">
                    <div className="overflow-hidden mb-16 bg-white rounded-2xl border border-gray-100 shadow-xl">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Campo Nome apenas se não houver convidado logado */}
                            {!convidado && (
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
                                        className="mt-2 input-field"
                                        placeholder="Como devemos te chamar?"
                                    />
                                </div>
                            )}
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
                                    className="mt-2 resize-none input-field"
                                    placeholder="Deixe aqui seu carinho e votos de felicidade..."
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2.5 px-5 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
                                >
                                    <Send className="mr-2 w-4 h-4" />
                                    Enviar Mensagem
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Lista de Mensagens */}
                <div>
                    {loading ? (
                        <div className="gap-6 columns-1 md:columns-2 lg:columns-3 xl:columns-4">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div
                                    key={n}
                                    className="mb-6 break-inside-avoid"
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
                        <div className="py-12 text-center text-red-500 bg-red-50 rounded-xl">
                            <div className="mx-auto max-w-md">
                                <p className="text-lg font-medium">{error}</p>
                                <p className="mt-2 text-sm text-red-400">
                                    Por favor, tente novamente mais tarde.
                                </p>
                            </div>
                        </div>
                    ) : mensagens.length === 0 ? (
                        <div className="py-16 text-center bg-gray-50 rounded-xl">
                            <MessageCircle className="mx-auto mb-6 w-16 h-16 text-gray-400" />
                            <h3 className="mb-3 font-serif text-xl font-medium text-gray-900">
                                Nenhuma mensagem ainda
                            </h3>
                            <p className="mx-auto max-w-md text-gray-500">
                                Seja o primeiro a deixar uma mensagem de carinho
                                para o casal!
                            </p>
                        </div>
                    ) : (
                        <div className="gap-6 columns-1 md:columns-2 lg:columns-3 xl:columns-4">
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
                                            <div className="absolute top-0 -left-1 text-3xl text-romantic-gold/20">
                                                "
                                            </div>
                                            <p className="pl-4 mb-4 text-sm italic text-gray-700 whitespace-pre-line">
                                                {msg.mensagem}
                                            </p>
                                            <div className="absolute right-0 -bottom-2 text-3xl transform rotate-180 text-romantic-gold/20">
                                                "
                                            </div>
                                        </div>

                                        {/* Autor e Data */}
                                        <div className="pt-4 mt-auto border-t border-gray-100">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex justify-center items-center w-8 h-8 text-sm font-bold text-white bg-gradient-to-r rounded-full from-romantic-gold to-primary-300">
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
                                                <Heart className="w-4 h-4 opacity-40 text-romantic-gold" />
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
