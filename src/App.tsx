import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import ConvidadoRoute from "./components/ConvidadoRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { ConvidadoProvider } from "./contexts/ConvidadoContext";
import Admin from "./pages/Admin";
import Confirmacao from "./pages/Confirmacao";
import ConvidadoLogin from "./pages/ConvidadoLogin";
import Estatisticas from "./pages/Estatisticas";
import Home from "./pages/Home";
import ListaPresentes from "./pages/ListaPresentes";
import Login from "./pages/Login";
import Mensagens from "./pages/Mensagens";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <Router>
            <AuthProvider>
                <ConvidadoProvider>
                <div className="min-h-screen bg-gradient-romantic">
                    {/* Configuração de notificações */}
                    <Toaster
                        position="top-right"
                        gutter={8}
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: "white",
                                color: "#374151",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                fontSize: "14px",
                                fontWeight: "500",
                                boxShadow:
                                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            },
                            success: {
                                iconTheme: {
                                    primary: "#10b981",
                                    secondary: "white",
                                },
                            },
                            error: {
                                iconTheme: {
                                    primary: "#ef4444",
                                    secondary: "white",
                                },
                            },
                        }}
                    />

                    {/* Header */}
                    <AppHeader />

                    {/* Conteúdo principal */}
                    <main className="romantic-pattern">
                        <ErrorBoundary>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/lista-presentes"
                                element={
                                    <ConvidadoRoute>
                                        <ListaPresentes />
                                    </ConvidadoRoute>
                                }
                            />
                            <Route 
                                path="/mensagens" 
                                element={
                                    <ConvidadoRoute>
                                        <Mensagens />
                                    </ConvidadoRoute>
                                } 
                            />
                            <Route
                                path="/confirmacao"
                                element={
                                    <ConvidadoRoute>
                                        <Confirmacao />
                                    </ConvidadoRoute>
                                }
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/convidado" element={<ConvidadoLogin />} />
                            <Route path="/convidado/:codigo" element={<ConvidadoLogin />} />
                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute>
                                        <Admin />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/estatisticas"
                                element={
                                    <ConvidadoRoute>
                                        <Estatisticas />
                                    </ConvidadoRoute>
                                }
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        </ErrorBoundary>
                    </main>

                    {/* Footer */}
                    <Footer />

                    {/* Efeitos decorativos flutuantes */}
                    <div
                        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
                        aria-hidden="true"
                    >
                        <div className="absolute top-20 left-10 w-6 h-6 text-primary-300 opacity-50 animate-float">
                            💕
                        </div>
                        <div
                            className="absolute top-40 right-20 w-6 h-6 text-secondary-300 opacity-50 animate-float"
                            style={{ animationDelay: "1s" }}
                        >
                            🌸
                        </div>
                        <div
                            className="absolute bottom-32 left-1/4 w-6 h-6 text-romantic-gold opacity-50 animate-float"
                            style={{ animationDelay: "2s" }}
                        >
                            ✨
                        </div>
                        <div
                            className="absolute top-1/3 right-10 w-6 h-6 text-primary-300 opacity-50 animate-float"
                            style={{ animationDelay: "3s" }}
                        >
                            🦋
                        </div>
                        <div
                            className="absolute bottom-20 right-1/3 w-6 h-6 text-secondary-300 opacity-50 animate-float"
                            style={{ animationDelay: "4s" }}
                        >
                            🏡
                        </div>
                    </div>
                </div>
                </ConvidadoProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
