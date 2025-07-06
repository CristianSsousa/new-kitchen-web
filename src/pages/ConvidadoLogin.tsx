import { Key, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useConvidado } from "../contexts/ConvidadoContext";

const ConvidadoLogin = () => {
    const [codigo, setCodigo] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { codigo: urlCodigo } = useParams();
    const { setConvidadoByCodigo } = useConvidado();

    // Se veio com código na URL, tenta logar automaticamente
    useEffect(() => {
        if (urlCodigo) {
            handleAutoLogin(urlCodigo);
        }
    }, [urlCodigo]);

    const handleAutoLogin = async (codigoUrl: string) => {
        setLoading(true);
        const success = await setConvidadoByCodigo(codigoUrl);
        setLoading(false);

        if (success) {
            toast.success("Bem-vindo(a)! 🎉");
            navigate("/");
        } else {
            toast.error("Código inválido ou expirado");
            setCodigo(codigoUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!codigo.trim()) {
            toast.error("Por favor, digite seu código");
            return;
        }

        setLoading(true);
        const success = await setConvidadoByCodigo(codigo.trim().toUpperCase());
        setLoading(false);

        if (success) {
            toast.success("Bem-vindo(a)! 🎉");
            navigate("/");
        } else {
            toast.error("Código inválido. Verifique e tente novamente.");
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-primary-50/30 flex items-center justify-center">
            <div className="max-w-md mx-auto">
                {/* Cabeçalho */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mb-4">
                        <Key className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                        Acesso do Convidado
                    </h1>
                    <p className="text-gray-600">
                        Digite seu código exclusivo para acessar lista de presentes, 
                        confirmar presença e deixar mensagens
                    </p>
                </div>

                {/* Formulário */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Código */}
                            <div>
                                <label htmlFor="codigo" className="form-label">
                                    Código do Convidado
                                </label>
                                <div className="mt-2 relative">
                                    <input
                                        type="text"
                                        id="codigo"
                                        name="codigo"
                                        required
                                        value={codigo}
                                        onChange={(e) =>
                                            setCodigo(e.target.value.toUpperCase())
                                        }
                                        className="input-field pl-12"
                                        placeholder="Ex: ABC123DEF456"
                                        maxLength={12}
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Você recebeu este código por WhatsApp ou convite
                                </p>
                            </div>

                            {/* Botão de Entrar */}
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
                                            <Key className="h-5 w-5 mr-2" />
                                            Acessar Minha Área
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Link para área geral */}
                        <div className="mt-6 text-center border-t border-gray-100 pt-6">
                            <p className="text-sm text-gray-500 mb-3">
                                Não tem um código?
                            </p>
                            <button
                                onClick={() => navigate("/")}
                                className="text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                            >
                                Acessar área geral do evento
                            </button>
                        </div>
                    </div>
                </div>

                {/* Informações adicionais */}
                <div className="mt-8 text-center">
                    <div className="bg-primary-50 rounded-xl p-4">
                        <h3 className="font-medium text-primary-900 mb-2">
                            Por que preciso de um código?
                        </h3>
                        <p className="text-sm text-primary-700">
                            Com seu código exclusivo você pode acessar a lista de presentes, 
                            confirmar sua presença e deixar mensagens. Os presentes escolhidos 
                            ficarão vinculados ao seu nome.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConvidadoLogin; 