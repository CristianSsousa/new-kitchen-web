import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Admin from "./pages/Admin";
import Confirmacao from "./pages/Confirmacao";
import Home from "./pages/Home";
import ListaPresentes from "./pages/ListaPresentes";
import Login from "./pages/Login";
import Mensagens from "./pages/Mensagens";

function App() {
    return (
        <Router>
            <AuthProvider>
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

                    {/* Navbar */}
                    <Navbar />

                    {/* Conteúdo principal */}
                    <main className="romantic-pattern">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/lista-presentes"
                                element={<ListaPresentes />}
                            />
                            <Route path="/mensagens" element={<Mensagens />} />
                            <Route
                                path="/confirmacao"
                                element={<Confirmacao />}
                            />
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute>
                                        <Admin />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </main>

                    {/* Footer */}
                    <Footer />

                    {/* Efeitos decorativos flutuantes */}
                    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
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
            </AuthProvider>
        </Router>
    );
}

export default App;
