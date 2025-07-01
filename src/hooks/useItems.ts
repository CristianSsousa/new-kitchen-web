import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { itemsApi } from "../services/api";
import type { CreateItemRequest, Item, ResgatarItemRequest } from "../types";

export const useItems = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Carregar itens
    const loadItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await itemsApi.getPublicItems();
            setItems(data);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao carregar itens";
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
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao criar item";
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
            setItems((prev) =>
                prev.map((item) => (item.id === id ? updatedItem : item))
            );
            toast.success("Item atualizado com sucesso! ✨");
            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao atualizar item";
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
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao remover item";
            toast.error(errorMessage);
            return false;
        }
    };

    // Resgatar item
    const resgatarItem = async (
        id: number,
        request: ResgatarItemRequest
    ): Promise<boolean> => {
        try {
            const updatedItem = await itemsApi.resgateItem(id, request);
            setItems((prev) =>
                prev.map((item) => (item.id === id ? updatedItem : item))
            );
            toast.success("Item reservado com sucesso! 🎁");
            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao reservar item";
            toast.error(errorMessage);
            return false;
        }
    };

    // Cancelar resgate
    const cancelarResgate = async (id: number): Promise<boolean> => {
        try {
            const updatedItem = await itemsApi.cancelaResgate(id);
            setItems((prev) =>
                prev.map((item) => (item.id === id ? updatedItem : item))
            );
            toast.success("Reserva cancelada com sucesso! ↩️");
            return true;
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "Erro ao cancelar reserva";
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
        resgatarItem,
        cancelarResgate,
    };
};
