import { Edit2, ExternalLink, Image as ImageIcon, Loader2, Package, Plus, Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import ItemModal from "../ItemModal";
import { useAdminItems } from "../../hooks/useAdminItems";
import type { CreateItemRequest, Item } from "../../types";
import { CATEGORIAS } from "../../types";
import { formatCurrency } from "../../utils/format";

type StatusFiltro = "todos" | "disponivel" | "reservado";
type Ordenacao = "nome_asc" | "nome_desc" | "preco_asc" | "preco_desc";

const AdminItens = () => {
    const { items, loading, error, loadingItemId, createItem, updateItem, deleteItem } =
        useAdminItems();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
    const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

    const [busca, setBusca] = useState("");
    const [categoria, setCategoria] = useState("todas");
    const [status, setStatus] = useState<StatusFiltro>("todos");
    const [ordenacao, setOrdenacao] = useState<Ordenacao>("nome_asc");

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

    const filteredItems = useMemo(() => {
        if (!items) return [];
        return items
            .filter((item) => {
                const matchBusca = item.nome.toLowerCase().includes(busca.toLowerCase());
                const matchCategoria = categoria === "todas" || item.categoria === categoria;
                const matchStatus =
                    status === "todos" ||
                    (status === "disponivel" && !item.resgatado) ||
                    (status === "reservado" && item.resgatado);
                return matchBusca && matchCategoria && matchStatus;
            })
            .sort((a, b) => {
                if (ordenacao === "nome_asc") return a.nome.localeCompare(b.nome);
                if (ordenacao === "nome_desc") return b.nome.localeCompare(a.nome);
                if (ordenacao === "preco_asc") return a.preco - b.preco;
                if (ordenacao === "preco_desc") return b.preco - a.preco;
                return 0;
            });
    }, [items, busca, categoria, status, ordenacao]);

    const filtrosAtivos = busca || categoria !== "todas" || status !== "todos" || ordenacao !== "nome_asc";

    const limparFiltros = () => {
        setBusca("");
        setCategoria("todas");
        setStatus("todos");
        setOrdenacao("nome_asc");
    };

    const reservados = items?.filter((i) => i.resgatado).length ?? 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Itens</h2>
                    {!loading && items && (
                        <p className="mt-0.5 text-sm text-gray-500">
                            {filtrosAtivos
                                ? `${filteredItems.length} de ${items.length} itens`
                                : `${items.length} ${items.length === 1 ? "item" : "itens"} cadastrados`}
                            {reservados > 0 && !filtrosAtivos && (
                                <span className="ml-2 text-green-600">
                                    · {reservados} reservados
                                </span>
                            )}
                        </p>
                    )}
                </div>
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

            {/* Barra de busca e filtros */}
            {!loading && !error && (items?.length ?? 0) > 0 && (
                <div className="mb-6 space-y-3">
                    {/* Busca */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            placeholder="Buscar por nome do item..."
                            className="input-field pl-9 pr-9"
                        />
                        {busca && (
                            <button
                                onClick={() => setBusca("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Filtros em linha */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />

                        {/* Categoria */}
                        <select
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                        >
                            <option value="todas">Todas as categorias</option>
                            {CATEGORIAS.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {/* Status */}
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                            {(["todos", "disponivel", "reservado"] as StatusFiltro[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s)}
                                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                        status === s
                                            ? "bg-primary-500 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {s === "todos" ? "Todos" : s === "disponivel" ? "Disponíveis" : "Reservados"}
                                </button>
                            ))}
                        </div>

                        {/* Ordenação */}
                        <select
                            value={ordenacao}
                            onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
                        >
                            <option value="nome_asc">Nome A–Z</option>
                            <option value="nome_desc">Nome Z–A</option>
                            <option value="preco_asc">Menor preço</option>
                            <option value="preco_desc">Maior preço</option>
                        </select>

                        {filtrosAtivos && (
                            <button
                                onClick={limparFiltros}
                                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Limpar
                            </button>
                        )}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="overflow-hidden bg-white rounded-xl border border-gray-100">
                            <div className="h-52 bg-gray-100 animate-pulse" />
                            <div className="p-4 space-y-2">
                                <div className="w-3/4 h-4 bg-gray-100 rounded animate-pulse" />
                                <div className="w-full h-3 bg-gray-100 rounded animate-pulse" />
                                <div className="w-2/3 h-3 bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="py-12 text-center text-red-500">{error}</div>
            ) : items?.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                    <Package className="mx-auto mb-3 w-12 h-12 opacity-40" />
                    <p className="font-medium text-gray-500">Nenhum item cadastrado</p>
                    <p className="mt-1 text-sm">Clique em "Novo Item" para começar</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                    <Search className="mx-auto mb-3 w-10 h-10 opacity-40" />
                    <p className="font-medium text-gray-500">Nenhum item encontrado</p>
                    <button onClick={limparFiltros} className="mt-2 text-sm text-primary-600 hover:underline">
                        Limpar filtros
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className={`flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg ${
                                item.resgatado ? "opacity-75" : ""
                            }`}
                        >
                            {/* Imagem com badges sobrepostos */}
                            <div className="relative bg-gray-100 h-52">
                                {imgErrors[item.id] ? (
                                    <div className="flex justify-center items-center w-full h-full bg-gray-50">
                                        <ImageIcon className="w-10 h-10 text-gray-300" />
                                    </div>
                                ) : (
                                    <img
                                        src={item.imagem_url}
                                        alt={item.nome}
                                        className="object-contain w-full h-full"
                                        onError={() =>
                                            setImgErrors((prev) => ({ ...prev, [item.id]: true }))
                                        }
                                    />
                                )}

                                <span className="absolute top-2 left-2 inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border shadow-sm backdrop-blur-sm bg-white/90 text-primary-700 border-primary-100">
                                    {item.categoria}
                                </span>

                                <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-1 text-xs font-semibold text-gray-900 rounded-md shadow-sm backdrop-blur-sm bg-white/90">
                                    {formatCurrency(item.preco)}
                                </span>

                                {item.resgatado && (
                                    <div className="flex absolute inset-0 justify-center items-center backdrop-blur-[1.5px] bg-black/50">
                                        <div className="px-4 py-2.5 text-center bg-white/95 rounded-xl shadow-lg">
                                            <p className="text-sm font-semibold text-gray-900">Reservado</p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                por {item.resgatado_por}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Conteúdo */}
                            <div className="flex flex-col flex-1 p-4">
                                <div className="flex-1 space-y-1.5">
                                    <h3 className="font-serif text-base font-bold leading-snug text-gray-900">
                                        {item.nome}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-gray-500 line-clamp-2">
                                        {item.descricao}
                                    </p>
                                </div>

                                {item.link_url && (
                                    <a
                                        href={item.link_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center mt-2 text-xs transition-colors text-primary-600 hover:text-primary-700"
                                    >
                                        <ExternalLink className="mr-1 h-3.5 w-3.5" />
                                        Ver referência
                                    </a>
                                )}

                                <div className="flex gap-2 items-center pt-3 mt-3 border-t border-gray-100">
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
