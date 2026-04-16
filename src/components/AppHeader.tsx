import { useAuth } from "../contexts/AuthContext";
import { useConvidado } from "../contexts/ConvidadoContext";
import AdminNavbar from "./AdminNavbar";
import Navbar from "./Navbar";

const AppHeader = () => {
    const { isAuthenticated } = useAuth();
    const { convidado } = useConvidado();

    if (isAuthenticated && !convidado) {
        return <AdminNavbar />;
    }

    return <Navbar />;
};

export default AppHeader;
