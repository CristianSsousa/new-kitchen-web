import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { itemsApi } from "../services/api";
import type { CreateItemRequest, Item } from "../types";
import { handleApiError } from "../utils/errors";

export const useAdminItems = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loadingItemId, setLoadingItemId] = useState<number | null>(null);

    const loadItems = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await itemsApi.getItems();
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
            setItems((prev) =>
                prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item))
            );
            toast.success("Item atualizado com sucesso! ✨");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao atualizar item");
            return false;
        }
    };

    const deleteItem = async (id: number): Promise<boolean> => {
        try {
            setLoadingItemId(id);
            await itemsApi.deleteItem(id);
            setItems((prev) => prev.filter((item) => item.id !== id));
            toast.success("Item removido com sucesso! 🗑️");
            return true;
        } catch (err) {
            handleApiError(err, "Erro ao remover item");
            return false;
        } finally {
            setLoadingItemId(null);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    return { items, loading, error, loadingItemId, loadItems, createItem, updateItem, deleteItem };
};
