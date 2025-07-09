import {
    Gift,
    Heart,
    Home,
    LogOut,
    Menu,
    MessageCircle,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useConvidado } from "../contexts/ConvidadoContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();
    const { convidado, clearConvidado } = useConvidado();

    // Extrair primeiro nome do convidado
    const firstName = convidado?.nome.split(" ")[0] || "";

    // Navegação para convidados logados
    const guestNavigation = [
        { name: "Início", href: "/", icon: Home },
        { name: "Lista de Presentes", href: "/lista-presentes", icon: Gift },
        { name: "Mensagens", href: "/mensagens", icon: MessageCircle },
        { name: "Confirmação", href: "/confirmacao", icon: Users },
    ];

    // Navegação para usuários não logados
    const publicNavigation = [
        { name: "Início", href: "/", icon: Home },
    ];

    const navigation = convidado ? guestNavigation : publicNavigation;

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-white/90 border-romantic-gold/20">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 group"
                        >
                            <div className="p-2 bg-gradient-to-r rounded-full transition-transform duration-200 from-primary-500 to-secondary-500 group-hover:scale-110">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="font-serif text-xl font-bold text-gradient">
                                    Chá de Casa Nova
                                </h1>
                                <p className="-mt-1 text-sm font-script text-romantic-gold">
                                    Cristian & Flavia
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <div className="hidden items-center space-x-8 md:flex">
                        {/* Botão do Convidado (desktop) */}
                        {convidado && (
                            <button
                                title="Clique para copiar seu código"
                                onClick={() => {
                                    navigator.clipboard.writeText(convidado.codigo_unico);
                                }}
                                className="flex items-center py-1.5 pr-4 pl-2 rounded-full transition-colors bg-primary-50 hover:bg-primary-100 group"
                            >
                                <div className="flex justify-center items-center mr-2 w-7 h-7 text-xs font-semibold text-white bg-gradient-to-r rounded-full shadow from-primary-500 to-secondary-500">
                                    {firstName.charAt(0)}
                                </div>
                                <span className="mr-2 text-sm font-medium text-primary-700">
                                    {firstName}
                                </span>
                                <code className="px-2 py-0.5 font-mono text-xs bg-white rounded border border-primary-200 text-primary-700 group-hover:bg-primary-50">
                                    {convidado.codigo_unico}
                                </code>
                            </button>
                        )}

                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        isActive(item.href)
                                            ? "bg-primary-100 text-primary-700 shadow-sm"
                                            : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        {convidado ? (
                            <button
                                onClick={clearConvidado}
                                className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-gray-600 rounded-full hover:text-red-500"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sair</span>
                            </button>
                        ) : (
                            !isAuthenticated && (
                                <Link
                                    to="/convidado"
                                    className="flex items-center px-3 py-2 space-x-2 text-sm font-medium rounded-full text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Área do Convidado</span>
                                </Link>
                            )
                        )}
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/admin"
                                    className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-gray-600 rounded-full hover:text-primary-600 hover:bg-primary-50"
                                >
                                    <Users className="w-4 h-4" />
                                    <span>Admin</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center px-3 py-2 space-x-2 text-sm font-medium text-gray-600 rounded-full hover:text-red-500"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-600 rounded-md transition-colors duration-200 hover:text-primary-600 hover:bg-primary-50"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="border-t backdrop-blur-md md:hidden bg-white/95 border-romantic-gold/20">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive(item.href)
                                            ? "bg-primary-100 text-primary-700"
                                            : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        {convidado ? (
                            <>
                                <button
                                    onClick={() => navigator.clipboard.writeText(convidado.codigo_unico)}
                                    className="px-3 py-2 rounded-lg transition transform bg-primary-50 active:scale-95"
                                >
                                    <span className="text-sm font-medium text-primary-700">
                                        Olá, {firstName}!
                                    </span>
                                    <code className="ml-2 text-xs font-mono px-1.5 py-0.5 rounded bg-white border border-primary-200 text-primary-700">
                                        {convidado.codigo_unico}
                                    </code>
                                </button>
                                <button
                                    onClick={() => {
                                        clearConvidado();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center px-3 py-2 space-x-3 text-sm font-medium text-gray-600 rounded-lg hover:text-red-500"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sair</span>
                                </button>
                            </>
                        ) : (
                            !isAuthenticated && (
                                <Link
                                    to="/convidado"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-3 py-2 space-x-3 text-sm font-medium rounded-lg text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                                >
                                    <Users className="w-5 h-5" />
                                    <span>Área do Convidado</span>
                                </Link>
                            )
                        )}
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center px-3 py-2 space-x-3 text-sm font-medium text-gray-600 rounded-lg hover:text-primary-600 hover:bg-primary-50"
                                >
                                    <Users className="w-5 h-5" />
                                    <span>Admin</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center px-3 py-2 space-x-3 text-sm font-medium text-gray-600 rounded-lg hover:text-red-500"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
