import {
    BarChart,
    Calendar,
    Check,
    Edit2,
    ExternalLink,
    Gift,
    MessageCircle,
    Plus,
    Trash2,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import EventoForm from "../components/EventoForm";
import ItemModal from "../components/ItemModal";
import { useAdminItems } from "../hooks/useAdminItems";
import { confirmacoesApi, mensagensApi, statsApi } from "../services/api";
import type {
    Confirmacao,
    CreateItemRequest,
    EstatisticasDetalhadas,
    Item,
    Mensagem,
} from "../types";
import { formatCurrency } from "../utils/format";

const Admin = () => {
    const [activeTab, setActiveTab] = useState<
        "itens" | "mensagens" | "confirmacoes" | "estatisticas" | "evento"
    >("itens");
    const {
        items,
        loading: itemsLoading,
        error: itemsError,
        loadItems,
        createItem,
        updateItem,
        deleteItem,
    } = useAdminItems();
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [confirmacoes, setConfirmacoes] = useState<Confirmacao[]>([]);
    const [stats, setStats] = useState<EstatisticasDetalhadas | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(
        undefined
    );

    // Carregar dados
    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            switch (activeTab) {
                case "mensagens":
                    const mensagensData = await mensagensApi.getMensagens();
                    setMensagens(mensagensData);
                    break;
                case "confirmacoes":
                    const confirmacoesData =
                        await confirmacoesApi.getConfirmacoes();
                    setConfirmacoes(confirmacoesData);
                    break;
                case "estatisticas":
                    const statsData =
                        await statsApi.getEstatisticasDetalhadas();
                    setStats(statsData);
                    break;
            }
        } catch (err) {
            setError("Erro ao carregar dados");
            toast.error("Não foi possível carregar os dados");
        } finally {
            setLoading(false);
        }
    };

    // Carregar dados quando a tab mudar
    useEffect(() => {
        if (activeTab === "itens") {
            loadItems();
        } else {
            loadData();
        }
    }, [activeTab]);

    // Aprovar mensagem
    const handleAprovarMensagem = async (id: number) => {
        try {
            await mensagensApi.aprovarMensagem(id);
            toast.success("Mensagem aprovada com sucesso!");
            loadData();
        } catch (err) {
            toast.error("Erro ao aprovar mensagem");
        }
    };

    // Deletar mensagem
    const handleDeletarMensagem = async (id: number) => {
        if (!confirm("Tem certeza que deseja deletar esta mensagem?")) return;

        try {
            await mensagensApi.deleteMensagem(id);
            toast.success("Mensagem deletada com sucesso!");
            loadData();
        } catch (err) {
            toast.error("Erro ao deletar mensagem");
        }
    };

    // Deletar confirmação
    const handleDeletarConfirmacao = async (id: number) => {
        if (!confirm("Tem certeza que deseja deletar esta confirmação?"))
            return;

        try {
            await confirmacoesApi.deleteConfirmacao(id);
            toast.success("Confirmação deletada com sucesso!");
            loadData();
        } catch (err) {
            toast.error("Erro ao deletar confirmação");
        }
    };

    // Criar item
    const handleCreateItem = async (item: CreateItemRequest) => {
        try {
            await createItem(item);
            setIsModalOpen(false);
        } catch (err) {
            toast.error("Erro ao criar item");
        }
    };

    // Editar item
    const handleEditItem = async (item: CreateItemRequest) => {
        try {
            if (!selectedItem) return;
            const success = await updateItem(selectedItem.id, item);
            if (success) {
                setIsModalOpen(false);
                setSelectedItem(undefined);
                // Recarrega a lista para garantir sincronização
                await loadItems();
            }
        } catch (err) {
            console.error("Erro ao atualizar item:", err);
            toast.error("Erro ao atualizar item. Tente novamente.");
        }
    };

    // Abrir modal para criar
    const handleOpenCreateModal = () => {
        setSelectedItem(undefined);
        setIsModalOpen(true);
    };

    // Abrir modal para editar
    const handleOpenEditModal = (item: Item) => {
        setSelectedItem({ ...item }); // Cria uma cópia do item
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho */}
                <div className="text-center mb-12">
                    <h1 className="title-romantic mb-4">Painel Admin</h1>
                    <p className="subtitle-romantic">
                        Gerencie itens, mensagens, confirmações, estatísticas e
                        informações do evento
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <nav className="flex space-x-4">
                        <button
                            onClick={() => setActiveTab("itens")}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                activeTab === "itens"
                                    ? "bg-primary-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Gift className="h-5 w-5 mr-2" />
                            <span>Itens</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("mensagens")}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                activeTab === "mensagens"
                                    ? "bg-primary-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <MessageCircle className="h-5 w-5 mr-2" />
                            <span>Mensagens</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("confirmacoes")}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                activeTab === "confirmacoes"
                                    ? "bg-primary-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Users className="h-5 w-5 mr-2" />
                            <span>Confirmações</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("estatisticas")}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                activeTab === "estatisticas"
                                    ? "bg-primary-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <BarChart className="h-5 w-5 mr-2" />
                            <span>Estatísticas</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("evento")}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                activeTab === "evento"
                                    ? "bg-primary-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Calendar className="h-5 w-5 mr-2" />
                            <span>Evento</span>
                        </button>
                    </nav>
                </div>

                {/* Conteúdo */}
                <div className="space-y-8">
                    {/* Lista de Itens */}
                    {activeTab === "itens" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Itens</h2>
                                <button
                                    onClick={handleOpenCreateModal}
                                    className="btn-primary"
                                >
                                    <Plus className="h-5 w-5 mr-2" />
                                    Novo Item
                                </button>
                            </div>

                            {itemsLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                        <div
                                            key={n}
                                            className="card animate-pulse h-96 bg-gray-100"
                                        />
                                    ))}
                                </div>
                            ) : itemsError ? (
                                <div className="text-center text-red-500">
                                    {itemsError}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg ${
                                                item.resgatado
                                                    ? "grayscale"
                                                    : ""
                                            }`}
                                        >
                                            {/* Cabeçalho com Categoria e Preço */}
                                            <div className="relative px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100">
                                                    {item.categoria}
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {formatCurrency(item.preco)}
                                                </span>
                                            </div>

                                            {/* Imagem */}
                                            <div className="relative h-48 bg-gray-100">
                                                <img
                                                    src={item.imagem_url}
                                                    alt={item.nome}
                                                    className="w-full h-full object-cover"
                                                />
                                                {item.resgatado && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                                        <div className="bg-black/80 px-4 py-2 rounded-lg text-white text-center">
                                                            <p className="font-medium">
                                                                Presente
                                                                Reservado
                                                            </p>
                                                            <p className="text-sm text-gray-300">
                                                                por{" "}
                                                                {
                                                                    item.resgatado_por
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Conteúdo */}
                                            <div className="p-4">
                                                <div className="space-y-3">
                                                    <div>
                                                        <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
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
                                                            className="inline-flex items-center text-xs text-primary-600 hover:text-primary-700 transition-colors"
                                                        >
                                                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                                            Ver referência
                                                        </a>
                                                    )}
                                                </div>

                                                {/* Ações */}
                                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                                    <button
                                                        onClick={() =>
                                                            handleOpenEditModal(
                                                                item
                                                            )
                                                        }
                                                        className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                                    >
                                                        <Edit2 className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                confirm(
                                                                    "Tem certeza que deseja excluir este item?"
                                                                )
                                                            ) {
                                                                deleteItem(
                                                                    item.id
                                                                );
                                                            }
                                                        }}
                                                        className="inline-flex items-center justify-center p-2 rounded-lg text-red-600 hover:text-white bg-red-50 hover:bg-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Lista de Mensagens */}
                    {activeTab === "mensagens" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">
                                Mensagens
                            </h2>
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map((n) => (
                                        <div
                                            key={n}
                                            className="bg-gray-100 h-24 rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-500">
                                    {error}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {mensagens.map((mensagem) => (
                                        <div
                                            key={mensagem.id}
                                            className="bg-white rounded-lg shadow-sm p-6"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold mb-2">
                                                        {mensagem.nome}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {mensagem.mensagem}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {!mensagem.aprovada && (
                                                        <button
                                                            onClick={() =>
                                                                handleAprovarMensagem(
                                                                    mensagem.id
                                                                )
                                                            }
                                                            className="btn-success"
                                                        >
                                                            <Check className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            handleDeletarMensagem(
                                                                mensagem.id
                                                            )
                                                        }
                                                        className="btn-danger"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Lista de Confirmações */}
                    {activeTab === "confirmacoes" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">
                                Confirmações
                            </h2>
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map((n) => (
                                        <div
                                            key={n}
                                            className="bg-gray-100 h-24 rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-500">
                                    {error}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {confirmacoes.map((confirmacao) => (
                                        <div
                                            key={confirmacao.id}
                                            className="bg-white rounded-lg shadow-sm p-6"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-bold mb-2">
                                                        {confirmacao.nome}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {
                                                            confirmacao.quantidade_adultos
                                                        }{" "}
                                                        adultos e{" "}
                                                        {
                                                            confirmacao.quantidade_criancas
                                                        }{" "}
                                                        crianças
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleDeletarConfirmacao(
                                                            confirmacao.id
                                                        )
                                                    }
                                                    className="btn-danger"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Estatísticas */}
                    {activeTab === "estatisticas" && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">
                                Estatísticas
                            </h2>
                            {loading ? (
                                <div className="animate-pulse space-y-4">
                                    {[1, 2, 3].map((n) => (
                                        <div
                                            key={n}
                                            className="bg-gray-100 h-24 rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-500">
                                    {error}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* Total de Itens */}
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm">
                                                    Total de Itens
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {stats?.total_itens}
                                                </h3>
                                            </div>
                                            <Gift className="h-8 w-8 text-primary-500" />
                                        </div>
                                    </div>

                                    {/* Total de Mensagens */}
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm">
                                                    Total de Mensagens
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {stats?.total_mensagens}
                                                </h3>
                                            </div>
                                            <MessageCircle className="h-8 w-8 text-primary-500" />
                                        </div>
                                    </div>

                                    {/* Total de Confirmações */}
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm">
                                                    Total de Confirmações
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {stats?.total_confirmacoes}
                                                </h3>
                                            </div>
                                            <Users className="h-8 w-8 text-primary-500" />
                                        </div>
                                    </div>

                                    {/* Total de Convidados */}
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm">
                                                    Total de Convidados
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {stats?.total_convidados}
                                                </h3>
                                            </div>
                                            <Calendar className="h-8 w-8 text-primary-500" />
                                        </div>
                                    </div>

                                    {/* Valor Total dos Itens */}
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm">
                                                    Valor Total dos Itens
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {formatCurrency(
                                                        stats?.valor_total_itens ||
                                                            0
                                                    )}
                                                </h3>
                                            </div>
                                            <BarChart className="h-8 w-8 text-primary-500" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Configurações do Evento */}
                    {activeTab === "evento" && <EventoForm />}

                    {/* Modal de Item */}
                    <ItemModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={
                            selectedItem ? handleEditItem : handleCreateItem
                        }
                        item={selectedItem}
                        title={
                            selectedItem ? "Editar Item" : "Adicionar Novo Item"
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Admin;
