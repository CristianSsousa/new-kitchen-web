import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <p className="text-8xl font-bold text-primary-200 mb-4">404</p>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Página não encontrada
            </h1>
            <p className="text-gray-500 mb-8">
                A página que você procura não existe ou foi removida.
            </p>
            <Link to="/" className="btn-primary flex items-center gap-2">
                <Home className="w-4 h-4" />
                Voltar ao início
            </Link>
        </div>
    );
};

export default NotFound;
