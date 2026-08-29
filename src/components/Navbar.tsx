import {
    CheckSquare,
    Copy,
    Gift,
    Home,
    LogOut,
    Menu,
    MessageCircle,
    Users,
    X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import { useConvidado } from "../contexts/ConvidadoContext";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { convidado, clearConvidado } = useConvidado();

    const firstName = convidado?.nome.split(" ")[0] || "";

    const guestNavigation = [
        { name: "Início", href: "/", icon: Home },
        { name: "Presentes", href: "/lista-presentes", icon: Gift },
        { name: "Mensagens", href: "/mensagens", icon: MessageCircle },
        { name: "Confirmação", href: "/confirmacao", icon: CheckSquare },
    ];

    const publicNavigation = [
        { name: "Início", href: "/", icon: Home },
    ];

    const navigation = convidado ? guestNavigation : publicNavigation;
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
            {/* Borda gradiente no topo */}
            <div className="h-0.5 bg-gradient-to-r from-primary-400 via-secondary-400 to-romantic-gold" />

            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
                        <img
                            src="/favicon.svg"
                            alt="Logo"
                            className="w-9 h-9 transition-transform duration-300 group-hover:scale-110 drop-shadow"
                        />
                        <div className="leading-tight">
                            <p className="font-serif text-lg font-bold text-gray-800 leading-none">
                                Chá de Casa Nova
                            </p>
                            <p className="font-script text-sm text-primary-500 leading-tight">
                                Cristian & Flavia
                            </p>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden items-center gap-1 lg:flex">
                        {navigation.map(({ name, href, icon: Icon }) => (
                            <Link
                                key={name}
                                to={href}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                    isActive(href)
                                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm"
                                        : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{name}</span>
                            </Link>
                        ))}

                        <div className="mx-2 h-6 w-px bg-gray-200" />

                        {convidado ? (
                            <div className="flex items-center gap-2">
                                {/* Badge do convidado */}
                                <button
                                    title="Clique para copiar seu código"
                                    onClick={() => {
                                        navigator.clipboard.writeText(convidado.codigo_unico);
                                        toast.success("Código copiado!");
                                    }}
                                    className="flex items-center gap-2 py-1.5 pl-1.5 pr-3 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors group cursor-pointer"
                                >
                                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xs font-bold shadow-sm">
                                        {firstName.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-primary-700">{firstName}</span>
                                    <code className="px-1.5 py-0.5 font-mono text-xs bg-white rounded border border-primary-100 text-primary-600 group-hover:border-primary-300 transition-colors">
                                        {convidado.codigo_unico}
                                    </code>
                                    <Copy className="w-3 h-3 text-primary-300 group-hover:text-primary-500 transition-colors" />
                                </button>

                                <button
                                    onClick={clearConvidado}
                                    title="Sair"
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 rounded-full hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sair</span>
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/convidado"
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-sm transition-all hover:shadow-md"
                            >
                                <Users className="w-4 h-4" />
                                <span>Área do Convidado</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors lg:hidden"
                        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="border-t border-gray-100 bg-white/95 backdrop-blur-md lg:hidden">
                    <div className="px-4 py-3 space-y-1">
                        {navigation.map(({ name, href, icon: Icon }) => (
                            <Link
                                key={name}
                                to={href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive(href)
                                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm"
                                        : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{name}</span>
                            </Link>
                        ))}

                        <div className="pt-1 border-t border-gray-100 mt-1">
                            {convidado ? (
                                <>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(convidado.codigo_unico);
                                            toast.success("Código copiado!");
                                        }}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl bg-primary-50 hover:bg-primary-100 transition-colors"
                                    >
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm font-bold">
                                            {firstName.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-primary-700">Olá, {firstName}!</p>
                                            <p className="text-xs font-mono text-primary-500">{convidado.codigo_unico}</p>
                                        </div>
                                        <Copy className="w-4 h-4 text-primary-400 ml-auto" />
                                    </button>
                                    <button
                                        onClick={() => { clearConvidado(); setIsOpen(false); }}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors mt-1"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Sair</span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/convidado"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-secondary-500"
                                >
                                    <Users className="w-5 h-5" />
                                    <span>Área do Convidado</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
