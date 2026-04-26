import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "../constants/storage";
import { authApi } from "../services/api";

interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
}

interface AuthContextData {
    isAuthenticated: boolean;
    token: string | null;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [auth, setAuth] = useState<AuthState>(() => {
        const storedToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
        return {
            isAuthenticated: !!storedToken,
            token: storedToken,
        };
    });

    useEffect(() => {
        if (auth.token) {
            localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, auth.token);
        } else {
            localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
        }
    }, [auth]);

    const login = async (password: string): Promise<boolean> => {
        const success = await authApi.login(password);
        if (success) {
            setAuth({ isAuthenticated: true, token: password });
        }
        return success;
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, token: null });
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: auth.isAuthenticated,
                token: auth.token,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
