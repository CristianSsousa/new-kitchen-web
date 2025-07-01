import { useEffect, useState } from "react";

interface AuthState {
    isAuthenticated: boolean;
    password: string | null;
}

const STORAGE_KEY = "adminPassword";

export const useAuth = () => {
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

    return {
        isAuthenticated: auth.isAuthenticated,
        password: auth.password,
        login,
        logout,
    };
};
