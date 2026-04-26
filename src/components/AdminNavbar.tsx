import { LogOut, Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
            {/* Borda gradiente no topo */}
            <div className="h-0.5 bg-gradient-to-r from-primary-400 via-secondary-400 to-romantic-gold" />

            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/admin" className="flex items-center gap-3 group flex-shrink-0">
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
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200">
                            <Shield className="w-3 h-3" />
                            Admin
                        </span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden items-center lg:flex">
                        <button
                            onClick={logout}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-500 rounded-full hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                        </button>
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
                    <div className="px-4 py-3">
                        <button
                            onClick={() => { logout(); setIsOpen(false); }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sair</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default AdminNavbar;
