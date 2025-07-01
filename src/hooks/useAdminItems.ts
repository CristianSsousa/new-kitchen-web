import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { itemsApi } from "../services/api";
import type { CreateItemRequest, Item } from "../types";

interface ApiErrorResponse {
    error: string;
}

export const useAdminItems = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar itens
    const loadItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await itemsApi.getItems();
            setItems(data);
        } catch (err) {
            console.error("Erro ao carregar itens:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as AxiosError<ApiErrorResponse>)?.response?.data
                          ?.error || "Erro ao carregar itens";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Criar item
    const createItem = async (
        itemData: CreateItemRequest
    ): Promise<boolean> => {
        try {
            const newItem = await itemsApi.createItem(itemData);
            setItems((prev) => [newItem, ...prev]);
            toast.success("Item criado com sucesso! 🎉");
            return true;
        } catch (err) {
            console.error("Erro ao criar item:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as AxiosError<ApiErrorResponse>)?.response?.data
                          ?.error || "Erro ao criar item";
            toast.error(errorMessage);
            return false;
        }
    };

    // Atualizar item
    const updateItem = async (
        id: number,
        itemData: CreateItemRequest
    ): Promise<boolean> => {
        try {
            const updatedItem = await itemsApi.updateItem(id, itemData);
            setItems((prev) => {
                const newItems = prev.map((item) =>
                    item.id === id ? { ...item, ...updatedItem } : item
                );
                return newItems;
            });
            toast.success("Item atualizado com sucesso! ✨");
            return true;
        } catch (err) {
            console.error("Erro ao atualizar item:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as AxiosError<ApiErrorResponse>)?.response?.data
                          ?.error || "Erro ao atualizar item";
            toast.error(errorMessage);
            return false;
        }
    };

    // Deletar item
    const deleteItem = async (id: number): Promise<boolean> => {
        try {
            await itemsApi.deleteItem(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
            toast.success("Item removido com sucesso! 🗑️");
            return true;
        } catch (err) {
            console.error("Erro ao remover item:", err);
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : (err as AxiosError<ApiErrorResponse>)?.response?.data
                          ?.error || "Erro ao remover item";
            toast.error(errorMessage);
            return false;
        }
    };

    // Carregar itens na inicialização
    useEffect(() => {
        loadItems();
    }, []);

    return {
        items,
        loading,
        error,
        loadItems,
        createItem,
        updateItem,
        deleteItem,
    };
};
