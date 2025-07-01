import { createContext, useContext, useEffect, useState } from "react";

interface AuthState {
    isAuthenticated: boolean;
    password: string | null;
}

interface AuthContextData {
    isAuthenticated: boolean;
    password: string | null;
    login: (password: string) => boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const STORAGE_KEY = "adminPassword";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [auth, setAuth] = useState<AuthState>(() => {
        const storedPassword = localStorage.getItem(STORAGE_KEY);
        return {
            isAuthenticated: !!storedPassword,
            password: storedPassword,
        };
    });

    useEffect(() => {
        if (auth.password) {
            localStorage.setItem(STORAGE_KEY, auth.password);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [auth]);

    const login = (password: string): boolean => {
        if (password === "admin123") {
            setAuth({ isAuthenticated: true, password });
            return true;
        }
        return false;
    };

    const logout = () => {
        setAuth({ isAuthenticated: false, password: null });
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: auth.isAuthenticated,
                password: auth.password,
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
