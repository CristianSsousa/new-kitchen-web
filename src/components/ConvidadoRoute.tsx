import { Navigate } from "react-router-dom";
import { useConvidado } from "../contexts/ConvidadoContext";

interface ConvidadoRouteProps {
    children: React.ReactNode;
}

const ConvidadoRoute = ({ children }: ConvidadoRouteProps) => {
    const { convidado, loading } = useConvidado();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!convidado) {
        return <Navigate to="/convidado" replace />;
    }

    return <>{children}</>;
};

export default ConvidadoRoute; 