import { Heart, LogOut, Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();

    return (
        <nav className="sticky top-0 z-50 border-b backdrop-blur-md bg-white/90 border-romantic-gold/20">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/admin" className="flex items-center space-x-2 group">
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
                        <span className="ml-3 hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 border border-primary-200">
                            <Shield className="w-3 h-3" />
                            Admin
                        </span>
                    </div>

                    {/* Desktop */}
                    <div className="hidden items-center lg:flex">
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-500 rounded-full hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                        </button>
                    </div>

                    {/* Mobile button */}
                    <div className="flex items-center lg:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-gray-600 rounded-md transition-colors hover:text-primary-600 hover:bg-primary-50"
                            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="border-t backdrop-blur-md lg:hidden bg-white/95 border-romantic-gold/20">
                    <div className="px-2 pt-2 pb-3">
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-3 py-2 space-x-3 text-sm font-medium text-gray-500 rounded-lg hover:text-red-500 hover:bg-red-50"
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
