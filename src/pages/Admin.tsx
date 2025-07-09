import {
    BarChart,
    Calendar,
    Check,
    Copy,
    Edit2,
    ExternalLink,
    Gift,
    Key,
    MessageCircle,
    Plus,
    RefreshCw,
    Trash2,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ConvidadoModal from "../components/ConvidadoModal";
import EventoForm from "../components/EventoForm";
import ItemModal from "../components/ItemModal";
import { useAdminConvidados } from "../hooks/useAdminConvidados";
import { useAdminItems } from "../hooks/useAdminItems";
import { confirmacoesApi, mensagensApi, statsApi } from "../services/api";
import type {
    Confirmacao,
    Convidado,
    CreateConvidadoRequest,
    CreateItemRequest,
    EstatisticasDetalhadas,
    Item,
    Mensagem,
} from "../types";
import { formatCurrency } from "../utils/format";

const Admin = () => {
    const [activeTab, setActiveTab] = useState<
        "itens" | "mensagens" | "confirmacoes" | "convidados" | "estatisticas" | "evento"
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
    const {
        convidados,
        loading: convidadosLoading,
        error: convidadosError,
        createConvidado,
        updateConvidado,
        deleteConvidado,
        regenerarCodigo,
    } = useAdminConvidados();
    const [mensagens, setMensagens] = useState<Mensagem[]>([]);
    const [confirmacoes, setConfirmacoes] = useState<Confirmacao[]>([]);
    const [confirmadosIds, setConfirmadosIds] = useState<Set<number>>(new Set());
    const [stats, setStats] = useState<EstatisticasDetalhadas | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConvidadoModalOpen, setIsConvidadoModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | undefined>(
        undefined
    );
    const [selectedConvidado, setSelectedConvidado] = useState<Convidado | undefined>(
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
                case "convidados":
                    const confs = await confirmacoesApi.getConfirmacoes();
                    setConfirmadosIds(new Set(confs.map((c) => c.convidado_id)));
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
        <div className="px-4 py-12 min-h-screen sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Cabeçalho */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 title-romantic">Painel Admin</h1>
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
                            <Gift className="mr-2 w-5 h-5" />
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
                            <MessageCircle className="mr-2 w-5 h-5" />
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
                            <Users className="mr-2 w-5 h-5" />
                            <span>Confirmações</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("convidados")}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                activeTab === "convidados"
                                    ? "bg-primary-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <Key className="mr-2 w-5 h-5" />
                            <span>Convidados</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("estatisticas")}
                            className={`flex items-center px-4 py-2 rounded-lg ${
                                activeTab === "estatisticas"
                                    ? "bg-primary-500 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                            <BarChart className="mr-2 w-5 h-5" />
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
                            <Calendar className="mr-2 w-5 h-5" />
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
                                    className="flex flex-row btn-primary"
                                >
                                    <Plus className="mr-2 w-7 h-5" />
                                    Novo Item
                                </button>
                            </div>

                            {itemsLoading ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {[1, 2, 3, 4, 5, 6].map((n) => (
                                        <div
                                            key={n}
                                            className="h-96 bg-gray-100 animate-pulse card"
                                        />
                                    ))}
                                </div>
                            ) : itemsError ? (
                                <div className="text-center text-red-500">
                                    {itemsError}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                                            <div className="flex relative justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
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
                                                    className="object-cover w-full h-full"
                                                />
                                                {item.resgatado && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                                        <div className="px-4 py-2 text-center text-white rounded-lg bg-black/80">
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

                                                {/* Ações */}
                                                <div className="flex gap-2 items-center pt-4 mt-4 border-t border-gray-100">
                                                    <button
                                                        onClick={() =>
                                                            handleOpenEditModal(
                                                                item
                                                            )
                                                        }
                                                        className="inline-flex flex-1 justify-center items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
                                                    >
                                                        <Edit2 className="mr-2 w-4 h-4" />
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
                                                        className="inline-flex justify-center items-center p-2 text-red-600 bg-red-50 rounded-lg transition-colors hover:text-white hover:bg-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
                            <h2 className="mb-6 text-2xl font-bold">
                                Mensagens
                            </h2>
                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map((n) => (
                                        <div
                                            key={n}
                                            className="h-24 bg-gray-100 rounded-lg"
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
                                            className="p-6 bg-white rounded-lg shadow-sm"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="mb-2 font-bold">
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
                                                            <Check className="w-5 h-5" />
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
                                                        <Trash2 className="w-5 h-5" />
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
                            <h2 className="mb-6 text-2xl font-bold">
                                Confirmações
                            </h2>
                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map((n) => (
                                        <div
                                            key={n}
                                            className="h-24 bg-gray-100 rounded-lg"
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
                                            className="p-6 bg-white rounded-lg shadow-sm"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="mb-2 font-bold">
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
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Lista de Convidados */}
                    {activeTab === "convidados" && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Convidados</h2>
                                <button
                                    onClick={() => {
                                        setSelectedConvidado(undefined);
                                        setIsConvidadoModalOpen(true);
                                    }}
                                    className="flex flex-row btn-primary"
                                >
                                    <Plus className="mr-2 w-5 h-5" />
                                    Novo Convidado
                                </button>
                            </div>

                            {convidadosLoading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <div
                                            key={n}
                                            className="h-32 bg-gray-100 rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : convidadosError ? (
                                <div className="text-center text-red-500">
                                    {convidadosError}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {convidados.map((convidado) => (
                                        <div
                                            key={convidado.id}
                                            className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center mb-3 space-x-3">
                                                        <h3 className="text-xl font-bold text-gray-900">
                                                            {convidado.nome}
                                                        </h3>
                                                        {confirmadosIds.has(convidado.id) && (
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Confirmado
                                                            </span>
                                                        )}
                                                        <code className="px-2 py-1 font-mono text-sm font-bold rounded bg-primary-100 text-primary-800">
                                                            {convidado.codigo_unico}
                                                        </code>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        {convidado.email && (
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Email:</span> {convidado.email}
                                                            </p>
                                                        )}
                                                        {convidado.telefone && (
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Telefone:</span> {convidado.telefone}
                                                            </p>
                                                        )}
                                                        {convidado.observacoes && (
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Observações:</span> {convidado.observacoes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(convidado.codigo_unico);
                                                            toast.success("Código copiado!");
                                                        }}
                                                        className="p-2 text-gray-600 rounded-lg transition-colors hover:text-primary-600 hover:bg-primary-50"
                                                        title="Copiar código"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const link = `${window.location.origin}/convidado/${convidado.codigo_unico}`;
                                                            navigator.clipboard.writeText(link);
                                                            toast.success("Link copiado!");
                                                        }}
                                                        className="p-2 text-gray-600 rounded-lg transition-colors hover:text-secondary-600 hover:bg-secondary-50"
                                                        title="Copiar link"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (
                                                                window.confirm(
                                                                    "Tem certeza que deseja gerar um novo código? O código atual ficará inválido."
                                                                )
                                                            ) {
                                                                await regenerarCodigo(convidado.id);
                                                            }
                                                        }}
                                                        className="p-2 text-gray-600 rounded-lg transition-colors hover:text-orange-600 hover:bg-orange-50"
                                                        title="Regenerar código"
                                                    >
                                                        <RefreshCw className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedConvidado(convidado);
                                                            setIsConvidadoModalOpen(true);
                                                        }}
                                                        className="p-2 text-gray-600 rounded-lg transition-colors hover:text-gray-800 hover:bg-gray-50"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (
                                                                window.confirm(
                                                                    "Tem certeza que deseja remover este convidado?"
                                                                )
                                                            ) {
                                                                await deleteConvidado(convidado.id);
                                                            }
                                                        }}
                                                        className="p-2 text-red-600 rounded-lg transition-colors hover:text-white hover:bg-red-600"
                                                        title="Remover"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
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
                            <h2 className="mb-6 text-2xl font-bold">
                                Estatísticas
                            </h2>
                            {loading ? (
                                <div className="space-y-4 animate-pulse">
                                    {[1, 2, 3].map((n) => (
                                        <div
                                            key={n}
                                            className="h-24 bg-gray-100 rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-500">
                                    {error}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    {/* Total de Itens */}
                                    <div className="p-6 bg-white rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Total de Itens
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {stats?.total_itens}
                                                </h3>
                                            </div>
                                            <Gift className="w-8 h-8 text-primary-500" />
                                        </div>
                                    </div>

                                    {/* Total de Mensagens */}
                                    <div className="p-6 bg-white rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Total de Mensagens
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {stats?.total_mensagens}
                                                </h3>
                                            </div>
                                            <MessageCircle className="w-8 h-8 text-primary-500" />
                                        </div>
                                    </div>

                                    {/* Total de Confirmações */}
                                    <div className="p-6 bg-white rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Total de Confirmações
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {stats?.total_confirmacoes}
                                                </h3>
                                            </div>
                                            <Users className="w-8 h-8 text-primary-500" />
                                        </div>
                                    </div>

                                    {/* Total de Convidados */}
                                    <div className="p-6 bg-white rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Total de Convidados
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {stats?.total_convidados}
                                                </h3>
                                            </div>
                                            <Calendar className="w-8 h-8 text-primary-500" />
                                        </div>
                                    </div>

                                    {/* Valor Total dos Itens */}
                                    <div className="p-6 bg-white rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Valor Total dos Itens
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {formatCurrency(
                                                        stats?.valor_total_itens ||
                                                            0
                                                    )}
                                                </h3>
                                            </div>
                                            <BarChart className="w-8 h-8 text-primary-500" />
                                        </div>
                                    </div>

                                    {/* Valor Reservado (itens resgatados) */}
                                    <div className="p-6 bg-white rounded-lg shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Valor Reservado
                                                </p>
                                                <h3 className="text-2xl font-bold">
                                                    {formatCurrency(
                                                        stats?.valor_resgatado_itens ||
                                                            0
                                                    )}
                                                </h3>
                                            </div>
                                            <Gift className="w-8 h-8 text-secondary-500" />
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

                    {/* Modal de Convidado */}
                    <ConvidadoModal
                        isOpen={isConvidadoModalOpen}
                        onClose={() => {
                            setIsConvidadoModalOpen(false);
                            setSelectedConvidado(undefined);
                        }}
                        onSubmit={async (convidadoData: CreateConvidadoRequest) => {
                            if (selectedConvidado) {
                                await updateConvidado(selectedConvidado.id, convidadoData);
                            } else {
                                await createConvidado(convidadoData);
                            }
                            setIsConvidadoModalOpen(false);
                            setSelectedConvidado(undefined);
                        }}
                        convidado={selectedConvidado}
                        title={
                            selectedConvidado ? "Editar Convidado" : "Novo Convidado"
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Admin;
