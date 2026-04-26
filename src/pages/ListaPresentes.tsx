import { ExternalLink, Filter, Gift, Loader2, Search, Star, X } from "lucide-react";
import { useState } from "react";
import { useItems } from "../hooks/useItems";
import { useConvidado } from "../contexts/ConvidadoContext";
import { formatCurrency } from "../utils/format";

const ListaPresentes = () => {
    const { items, loading, resgatarItem, cancelarResgate, error, loadingItemId } = useItems();
    const { convidado, stats, refreshStats } = useConvidado();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
    const [filtroReservados, setFiltroReservados] = useState<"todos" | "disponiveis" | "reservados">("todos");

    const meusIds = stats?.itens_resgatados.map((it) => it.id) || [];

    // Extrair categorias únicas dos itens
    const categories = [
        "Todos",
        ...new Set(items?.map((item) => item.categoria)),
    ];

    const normalize = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Filtrar itens
    const filteredItems = items?.filter((item) => {
        const termo = normalize(search.trim());
        const matchesSearch =
            !termo ||
            normalize(item.nome ?? "").includes(termo) ||
            normalize(item.descricao ?? "").includes(termo);
        const matchesCategory =
            selectedCategory === "Todos" || item.categoria === selectedCategory;
        const matchesResgatados =
            filtroReservados === "todos" ? true :
            filtroReservados === "disponiveis" ? !item.resgatado :
            item.resgatado;
        return matchesSearch && matchesCategory && matchesResgatados;
    });

    // Função para resgatar presente
    const handleResgatar = async (id: number) => {
        if (loadingItemId !== null) return;

        let nome: string;

        if (convidado) {
            nome = convidado.nome;
        } else {
            const inputNome = prompt(
                "Por favor, digite seu nome para reservar este presente:"
            );
            if (!inputNome) return;
            nome = inputNome;
        }

        const success = await resgatarItem(id, {
            nome,
            codigo_convidado: convidado?.codigo_unico
        });

        if (success && convidado) {
            await refreshStats();
        }
    };

    // Função para cancelar reserva
    const cancelarOwnResgate = async (id: number) => {
        if (loadingItemId !== null) return;

        const success = await cancelarResgate(id);
        if (success && convidado) {
            await refreshStats();
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho */}
                <div className="text-center mb-12">
                    <h1 className="title-romantic mb-4">Lista de Presentes</h1>
                    <p className="subtitle-romantic">
                        Escolha um presente especial para nosso novo lar 🏡
                    </p>
                </div>

                {/* Filtros e Busca */}
                <div className="mb-8 space-y-4">
                    {/* Barra de Busca */}
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Buscar presente..."
                            className="input-field pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-3 justify-center items-center">
                        {/* Categorias */}
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        selectedCategory === category
                                            ? "bg-primary-500 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Filtro de disponibilidade */}
                        <div className="flex items-center gap-1 p-1 bg-white rounded-full border border-gray-200">
                            <Filter className="h-4 w-4 text-gray-400 ml-2" />
                            {(["todos", "disponiveis", "reservados"] as const).map((opcao) => (
                                <button
                                    key={opcao}
                                    onClick={() => setFiltroReservados(opcao)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                        filtroReservados === opcao
                                            ? "bg-secondary-500 text-white shadow-sm"
                                            : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {opcao === "todos" ? "Todos" : opcao === "disponiveis" ? "Disponíveis" : "Reservados"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lista de Presentes */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={n}
                                className="card animate-pulse h-96 bg-gray-100"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">
                        Erro ao carregar presentes. Tente novamente mais tarde.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredItems?.map((item) => (
                            <div
                                key={item.id}
                                className={`relative bg-white rounded-2xl overflow-hidden border border-gray-100 ${
                                    item.resgatado
                                        ? meusIds.includes(item.id)
                                            ? "bg-green-50 border-green-200"
                                            : "grayscale opacity-80"
                                        : "hover:border-primary-200"
                                }`}
                            >
                                {/* Tag de Categoria */}
                                <div className="absolute z-10 left-4 top-4">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white/95 shadow-md text-primary-700 border border-primary-100">
                                        {item.categoria}
                                    </span>
                                </div>

                                {/* Preço Tag */}
                                <div className="absolute z-10 right-4 top-4">
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-primary-500 text-white shadow-md">
                                        {formatCurrency(item.preco)}
                                    </span>
                                </div>

                                {/* Tag "Meu Presente" */}
                                {meusIds.includes(item.id) && (
                                    <div className="absolute z-10 right-4 bottom-4">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 border border-green-200 shadow-md">
                                            <Star className="h-4 w-4 mr-1 -mt-1" /> Meu Presente
                                        </span>
                                    </div>
                                )}

                                {/* Imagem com Overlay Gradiente */}
                                <div className="relative h-64">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-[1]" />
                                    <img
                                        src={item.imagem_url}
                                        alt={item.nome}
                                        className="w-full h-full object-cover"
                                    />
                                    {item.resgatado && !meusIds.includes(item.id) && (
                                        <div className="absolute inset-0 z-[2] bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <div className="bg-black/80 px-6 py-4 rounded-xl text-white text-center transform -rotate-6 shadow-xl">
                                                <p className="font-bold text-2xl">
                                                    Presente Reservado
                                                </p>
                                                <p className="text-white/90 mt-1">
                                                    por {item.resgatado_por}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Conteúdo */}
                                <div className="relative z-[2] p-6 bg-white">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">
                                                {item.nome}
                                            </h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">
                                                {item.descricao}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            {item.link_url && (
                                                <a
                                                    href={item.link_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors duration-200"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    Ver Produto
                                                </a>
                                            )}
                                        </div>

                                        {/* Botão de Resgatar */}
                                        {!item.resgatado ? (
                                            <button
                                                onClick={() => handleResgatar(item.id)}
                                                disabled={loadingItemId !== null}
                                                className="w-full mt-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-xl font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {loadingItemId === item.id ? (
                                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                ) : (
                                                    <Gift className="h-5 w-5 mr-2" />
                                                )}
                                                {loadingItemId === item.id ? "Reservando..." : "Reservar Presente"}
                                            </button>
                                        ) : (
                                            meusIds.includes(item.id) && (
                                                <button
                                                    onClick={() => cancelarOwnResgate(item.id)}
                                                    disabled={loadingItemId !== null}
                                                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {loadingItemId === item.id ? (
                                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                    ) : null}
                                                    {loadingItemId === item.id ? "Cancelando..." : "Cancelar Reserva"}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Mensagem quando não há resultados */}
                {!loading && filteredItems?.length === 0 && (
                    <div className="text-center py-12">
                        <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum presente encontrado
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {search && selectedCategory !== "Todos"
                                ? `Nenhum resultado para "${search}" na categoria "${selectedCategory}"`
                                : search
                                ? `Nenhum resultado para "${search}"`
                                : selectedCategory !== "Todos"
                                ? `Nenhum presente na categoria "${selectedCategory}"`
                                : "Nenhum presente disponível no momento"}
                        </p>
                        {(search || selectedCategory !== "Todos") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setSelectedCategory("Todos");
                                }}
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                            >
                                <X className="h-4 w-4 mr-1.5" />
                                Limpar filtros
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListaPresentes;
