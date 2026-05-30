import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { convidadosApi } from "../services/api";
import type { CreateConvidadoRequest, Convidado } from "../types";
import { handleApiError } from "../utils/errors";

export const useAdminConvidados = () => {
    const [convidados, setConvidados] = useState<Convidado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingConvidadoId, setLoadingConvidadoId] = useState<number | null>(null);

    const loadConvidados = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await convidadosApi.getConvidados();
            setConvidados(data);
        } catch (err) {
            const message = handleApiError(err, "Erro ao carregar convidados");
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const createConvidado = async (convidadoData: CreateConvidadoRequest): Promise<boolean> => {
        try {
            const newConvidado = await convidadosApi.createConvidado(convidadoData);
            setConvidados((prev) => [newConvidado, ...prev]);
            toast.success("Convidado criado com sucesso! 🎉");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao criar convidado");
            return false;
        }
    };

    const updateConvidado = async (id: number, convidadoData: CreateConvidadoRequest): Promise<boolean> => {
        try {
            const updatedConvidado = await convidadosApi.updateConvidado(id, {
                nome: convidadoData.nome,
                email: convidadoData.email,
                telefone: convidadoData.telefone,
                observacoes: convidadoData.observacoes,
                guest_of: convidadoData.guest_of,
            });
            setConvidados((prev) =>
                prev.map((c) => (c.id === id ? { ...c, ...updatedConvidado } : c))
            );
            toast.success("Convidado atualizado com sucesso! ✨");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao atualizar convidado");
            return false;
        }
    };

    const deleteConvidado = async (id: number): Promise<boolean> => {
        try {
            setLoadingConvidadoId(id);
            await convidadosApi.deleteConvidado(id);
            setConvidados((prev) => prev.filter((c) => c.id !== id));
            toast.success("Convidado removido com sucesso! 🗑️");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao remover convidado");
            return false;
        } finally {
            setLoadingConvidadoId(null);
        }
    };

    const regenerarCodigo = async (id: number): Promise<boolean> => {
        try {
            setLoadingConvidadoId(id);
            const response = await convidadosApi.regenerarCodigo(id);
            setConvidados((prev) =>
                prev.map((c) =>
                    c.id === id ? { ...c, codigo_unico: response.codigo } : c
                )
            );
            toast.success("Código regenerado com sucesso! 🔄");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao regenerar código");
            return false;
        } finally {
            setLoadingConvidadoId(null);
        }
    };

    useEffect(() => {
        loadConvidados();
    }, []);

    return {
        convidados,
        loading,
        error,
        loadingConvidadoId,
        loadConvidados,
        createConvidado,
        updateConvidado,
        deleteConvidado,
        regenerarCodigo,
    };
};
