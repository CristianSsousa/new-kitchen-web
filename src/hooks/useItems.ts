import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { itemsApi } from "../services/api";
import type { CreateItemRequest, Item, ResgatarItemRequest } from "../types";
import { handleApiError } from "../utils/errors";

export const useItems = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingItemId, setLoadingItemId] = useState<number | null>(null);

    const loadItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await itemsApi.getPublicItems();
            setItems(data);
        } catch (err) {
            const message = handleApiError(err, "Erro ao carregar itens");
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const createItem = async (itemData: CreateItemRequest): Promise<boolean> => {
        try {
            const newItem = await itemsApi.createItem(itemData);
            setItems((prev) => [newItem, ...prev]);
            toast.success("Item criado com sucesso! 🎉");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao criar item");
            return false;
        }
    };

    const updateItem = async (id: number, itemData: CreateItemRequest): Promise<boolean> => {
        try {
            const updatedItem = await itemsApi.updateItem(id, itemData);
            setItems((prev) => prev.map((item) => (item.id === id ? updatedItem : item)));
            toast.success("Item atualizado com sucesso! ✨");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao atualizar item");
            return false;
        }
    };

    const deleteItem = async (id: number): Promise<boolean> => {
        try {
            await itemsApi.deleteItem(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
            toast.success("Item removido com sucesso! 🗑️");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao remover item");
            return false;
        }
    };

    const resgatarItem = async (id: number, request: ResgatarItemRequest): Promise<boolean> => {
        try {
            setLoadingItemId(id);
            const updatedItem = await itemsApi.resgateItem(id, request);
            setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)));
            toast.success("Item reservado com sucesso! 🎁");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao reservar item");
            return false;
        } finally {
            setLoadingItemId(null);
        }
    };

    const cancelarResgate = async (id: number): Promise<boolean> => {
        try {
            setLoadingItemId(id);
            const updatedItem = await itemsApi.cancelaResgate(id);
            setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)));
            toast.success("Reserva cancelada com sucesso! ↩️");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao cancelar reserva");
            return false;
        } finally {
            setLoadingItemId(null);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    return {
        items,
        loading,
        error,
        loadingItemId,
        loadItems,
        createItem,
        updateItem,
        deleteItem,
        resgatarItem,
        cancelarResgate,
    };
};
