import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const success = login(password);
            if (success) {
                toast.success("Login realizado com sucesso!");
            } else {
                toast.error("Senha incorreta");
            }
        } catch (err) {
            toast.error("Erro ao realizar login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full">
                {/* Cabeçalho */}
                <div className="text-center mb-8">
                    <h1 className="title-romantic mb-4">Área Administrativa</h1>
                    <p className="subtitle-romantic">
                        Digite a senha para acessar
                    </p>
                </div>

                {/* Formulário */}
                <div className="card-romantic p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="input-field pl-10"
                                    placeholder="Digite a senha de acesso"
                                    required
                                />
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-romantic w-full"
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>
                </div>

                {/* Dica */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Em caso de dúvidas, entre em contato com os administradores.
                </p>
            </div>
        </div>
    );
};

export default Login;
