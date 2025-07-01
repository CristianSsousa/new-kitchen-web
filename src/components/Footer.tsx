import { Heart } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white/80 backdrop-blur-sm border-t border-romantic-gold/20 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Heart className="h-5 w-5 text-primary-500" />
                        <span className="font-serif text-lg font-semibold text-primary-600">
                            Cristian & Flavia
                        </span>
                        <Heart className="h-5 w-5 text-primary-500" />
                    </div>
                    <p className="text-gray-600 mb-2">
                        Celebrando o amor e construindo nosso lar juntos 💕
                    </p>
                    <p className="text-sm text-gray-500">
                        Feito com muito amor e carinho para nossa nova jornada
                    </p>
                    <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-400">
                        <span>💒 2025</span>
                        <span>•</span>
                        <span>🏡 Novo Lar</span>
                        <span>•</span>
                        <span>💝 Presentes com Amor</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
