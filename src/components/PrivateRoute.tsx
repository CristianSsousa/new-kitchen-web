import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
