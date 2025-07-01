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
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    const navigation = [
        { name: "Início", href: "/", icon: Home },
        { name: "Lista de Presentes", href: "/lista-presentes", icon: Gift },
        { name: "Mensagens", href: "/mensagens", icon: MessageCircle },
        { name: "Confirmação", href: "/confirmacao", icon: Users },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-romantic-gold/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 group"
                        >
                            <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full group-hover:scale-110 transition-transform duration-200">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="font-serif text-xl font-bold text-gradient">
                                    Chá de Casa Nova
                                </h1>
                                <p className="font-script text-sm text-romantic-gold -mt-1">
                                    Cristian & Flavia
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
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
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/admin"
                                    className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                                >
                                    <Users className="h-4 w-4" />
                                    <span>Admin</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium text-gray-600 hover:text-red-500"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                        >
                            {isOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-romantic-gold/20">
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
                                    <Icon className="h-5 w-5" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        {isAuthenticated && (
                            <>
                                <Link
                                    to="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                                >
                                    <Users className="h-5 w-5" />
                                    <span>Admin</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500"
                                >
                                    <LogOut className="h-5 w-5" />
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
