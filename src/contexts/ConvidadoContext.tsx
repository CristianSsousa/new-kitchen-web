import { createContext, useContext, useEffect, useState } from "react";
import type { ConvidadoPublico, ConvidadoStats } from "../types";
import { convidadosApi } from "../services/api";

interface ConvidadoContextData {
    convidado: ConvidadoPublico | null;
    stats: ConvidadoStats | null;
    loading: boolean;
    error: string | null;
    setConvidadoByCodigo: (codigo: string) => Promise<boolean>;
    clearConvidado: () => void;
    refreshStats: () => Promise<void>;
}

const ConvidadoContext = createContext<ConvidadoContextData>({} as ConvidadoContextData);

export const ConvidadoProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [convidado, setConvidado] = useState<ConvidadoPublico | null>(null);
    const [stats, setStats] = useState<ConvidadoStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar convidado por código
    const setConvidadoByCodigo = async (codigo: string): Promise<boolean> => {
        try {
            setLoading(true);
            setError(null);
            
            const convidadoData = await convidadosApi.getConvidadoByCodigo(codigo);
            const statsData = await convidadosApi.getConvidadoStats(codigo);
            
            setConvidado(convidadoData);
            setStats(statsData);
            
            // Salvar no localStorage para persistir
            localStorage.setItem("convidado_codigo", codigo);
            
            return true;
        } catch (err) {
            setError("Convidado não encontrado");
            setConvidado(null);
            setStats(null);
            localStorage.removeItem("convidado_codigo");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Limpar convidado
    const clearConvidado = () => {
        setConvidado(null);
        setStats(null);
        setError(null);
        localStorage.removeItem("convidado_codigo");
    };

    // Atualizar estatísticas
    const refreshStats = async () => {
        if (!convidado) return;

        try {
            const statsData = await convidadosApi.getConvidadoStats(convidado.codigo_unico);
            setStats(statsData);
        } catch (err) {
            console.error("Erro ao atualizar estatísticas:", err);
        }
    };

    // Carregar convidado do localStorage na inicialização
    useEffect(() => {
        const savedCodigo = localStorage.getItem("convidado_codigo");
        if (savedCodigo) {
            setConvidadoByCodigo(savedCodigo).finally(() => {
                // independentemente do resultado, loading será atualizado dentro da função
            });
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <ConvidadoContext.Provider
            value={{
                convidado,
                stats,
                loading,
                error,
                setConvidadoByCodigo,
                clearConvidado,
                refreshStats,
            }}
        >
            {children}
        </ConvidadoContext.Provider>
    );
};

export const useConvidado = () => {
    const context = useContext(ConvidadoContext);

    if (!context) {
        throw new Error("useConvidado must be used within a ConvidadoProvider");
    }

    return context;
}; 