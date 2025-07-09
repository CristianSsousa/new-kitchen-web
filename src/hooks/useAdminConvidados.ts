import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convidadosApi } from "../services/api";
import type { CreateConvidadoRequest, Convidado } from "../types";

interface ApiErrorResponse {
    error: string;
}

export const useAdminConvidados = () => {
    const [convidados, setConvidados] = useState<Convidado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar convidados
    const loadConvidados = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await convidadosApi.getConvidados();
            setConvidados(data);
        } catch (err) {
            console.error("Erro ao carregar convidados:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as AxiosError<ApiErrorResponse>)?.response?.data
                          ?.error || "Erro ao carregar convidados";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Criar convidado
    const createConvidado = async (
        convidadoData: CreateConvidadoRequest
    ): Promise<boolean> => {
        try {
            const newConvidado = await convidadosApi.createConvidado(convidadoData);
            setConvidados((prev) => [newConvidado, ...prev]);
            toast.success("Convidado criado com sucesso! 🎉");
            return true;
        } catch (err) {
            console.error("Erro ao criar convidado:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as AxiosError<ApiErrorResponse>)?.response?.data
                          ?.error || "Erro ao criar convidado";
            toast.error(errorMessage);
            return false;
        }
    };

    // Atualizar convidado
    const updateConvidado = async (
        id: number,
        convidadoData: CreateConvidadoRequest
    ): Promise<boolean> => {
        try {
            const updatedConvidado = await convidadosApi.updateConvidado(id, {
                nome: convidadoData.nome,
                email: convidadoData.email,
                telefone: convidadoData.telefone,
                observacoes: convidadoData.observacoes,
            });
            setConvidados((prev) => {
                const newConvidados = prev.map((convidado) =>
                    convidado.id === id ? { ...convidado, ...updatedConvidado } : convidado
                );
                return newConvidados;
            });
            toast.success("Convidado atualizado com sucesso! ✨");
            return true;
        } catch (err) {
            console.error("Erro ao atualizar convidado:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as AxiosError<ApiErrorResponse>)?.response?.data
                          ?.error || "Erro ao atualizar convidado";
            toast.error(errorMessage);
            return false;
        }
    };

    // Deletar convidado
    const deleteConvidado = async (id: number): Promise<boolean> => {
        try {
            await convidadosApi.deleteConvidado(id);
            setConvidados((prev) => prev.filter((convidado) => convidado.id !== id));
            toast.success("Convidado removido com sucesso! 🗑️");
            return true;
        } catch (err) {
            console.error("Erro ao remover convidado:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as AxiosError<ApiErrorResponse>)?.response?.data
                          ?.error || "Erro ao remover convidado";
            toast.error(errorMessage);
            return false;
        }
    };

    // Regenerar código do convidado
    const regenerarCodigo = async (id: number): Promise<boolean> => {
        try {
            const response = await convidadosApi.regenerarCodigo(id);
            // Atualiza o convidado com o novo código
            setConvidados((prev) =>
                prev.map((convidado) =>
                    convidado.id === id
                        ? { ...convidado, codigo_unico: response.codigo }
                        : convidado
                )
            );
            toast.success("Código regenerado com sucesso! 🔄");
            return true;
        } catch (err) {
            console.error("Erro ao regenerar código:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as AxiosError<ApiErrorResponse>)?.response?.data
                          ?.error || "Erro ao regenerar código";
            toast.error(errorMessage);
            return false;
        }
    };

    // Carregar convidados na inicialização
    useEffect(() => {
        loadConvidados();
    }, []);

    return {
        convidados,
        loading,
        error,
        loadConvidados,
        createConvidado,
        updateConvidado,
        deleteConvidado,
        regenerarCodigo,
    };
}; 