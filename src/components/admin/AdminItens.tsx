import { Edit2, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import ItemModal from "../ItemModal";
import { useAdminItems } from "../../hooks/useAdminItems";
import type { CreateItemRequest, Item } from "../../types";
import { formatCurrency } from "../../utils/format";

const AdminItens = () => {
    const { items, loading, error, loadingItemId, createItem, updateItem, deleteItem } =
        useAdminItems();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);

    const handleCreateItem = async (item: CreateItemRequest) => {
        const success = await createItem(item);
        if (success) setIsModalOpen(false);
    };

    const handleEditItem = async (item: CreateItemRequest) => {
        if (!selectedItem) return;
        const success = await updateItem(selectedItem.id, item);
        if (success) {
            setIsModalOpen(false);
            setSelectedItem(undefined);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Itens</h2>
                <button
                    onClick={() => {
                        setSelectedItem(undefined);
                        setIsModalOpen(true);
                    }}
                    className="flex flex-row btn-primary"
                >
                    <Plus className="mr-2 w-7 h-5" />
                    Novo Item
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="h-96 bg-gray-100 animate-pulse card" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {items?.map((item) => (
                        <div
                            key={item.id}
                            className={`bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg ${
                                item.resgatado ? "grayscale" : ""
                            }`}
                        >
                            <div className="flex relative justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
                                    {item.categoria}
                                </span>
                                <span className="font-medium text-gray-900">
                                    {formatCurrency(item.preco)}
                                </span>
                            </div>

                            <div className="relative h-48 bg-gray-100">
                                <img
                                    src={item.imagem_url}
                                    alt={item.nome}
                                    className="object-cover w-full h-full"
                                />
                                {item.resgatado && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                        <div className="px-4 py-2 text-center text-white rounded-lg bg-black/80">
                                            <p className="font-medium">Presente Reservado</p>
                                            <p className="text-sm text-gray-300">
                                                por {item.resgatado_por}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="mb-1 font-serif text-lg font-bold text-gray-900">
                                            {item.nome}
                                        </h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {item.descricao}
                                        </p>
                                    </div>

                                    {item.link_url && (
                                        <a
                                            href={item.link_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-xs transition-colors text-primary-600 hover:text-primary-700"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                            Ver referência
                                        </a>
                                    )}
                                </div>

                                <div className="flex gap-2 items-center pt-4 mt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => {
                                            setSelectedItem({ ...item });
                                            setIsModalOpen(true);
                                        }}
                                        className="inline-flex flex-1 justify-center items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
                                        aria-label="Editar item"
                                    >
                                        <Edit2 className="mr-2 w-4 h-4" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm("Tem certeza que deseja excluir este item?")) {
                                                deleteItem(item.id);
                                            }
                                        }}
                                        disabled={loadingItemId === item.id}
                                        className="inline-flex justify-center items-center p-2 text-red-600 bg-red-50 rounded-lg transition-colors hover:text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
                                        aria-label="Excluir item"
                                    >
                                        {loadingItemId === item.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ItemModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedItem(undefined);
                }}
                onSubmit={selectedItem ? handleEditItem : handleCreateItem}
                item={selectedItem}
                title={selectedItem ? "Editar Item" : "Adicionar Novo Item"}
            />
        </div>
    );
};

export default AdminItens;
