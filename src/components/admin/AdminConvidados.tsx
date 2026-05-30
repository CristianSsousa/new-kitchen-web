import {
    CheckCircle2,
    Copy,
    Edit2,
    Link2,
    Loader2,
    Mail,
    MessageCircle,
    Plus,
    RefreshCw,
    Search,
    Share2,
    Trash2,
    UserCheck,
    UserCircle2,
    Users,
    X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ConvidadoModal from "../ConvidadoModal";
import { useAdminConvidados } from "../../hooks/useAdminConvidados";
import { confirmacoesApi } from "../../services/api";
import type { Convidado, CreateConvidadoRequest } from "../../types";

const AdminConvidados = () => {
    const {
        convidados,
        loading,
        error,
        loadingConvidadoId,
        createConvidado,
        updateConvidado,
        deleteConvidado,
        regenerarCodigo,
    } = useAdminConvidados();

    const [confirmadosIds, setConfirmadosIds] = useState<Set<number>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedConvidado, setSelectedConvidado] = useState<Convidado | undefined>(undefined);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [shareMenuId, setShareMenuId] = useState<number | null>(null);
    const shareMenuRef = useRef<HTMLDivElement>(null);
    const PER_PAGE = 10;

    const loadConfirmados = useCallback(async () => {
        try {
            const confs = await confirmacoesApi.getConfirmacoes();
            setConfirmadosIds(new Set(confs.map((c) => c.convidado_id)));
        } catch {
            // não crítico
        }
    }, []);

    useEffect(() => {
        loadConfirmados();
    }, [loadConfirmados]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
                setShareMenuId(null);
            }
        };
        if (shareMenuId !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [shareMenuId]);

    const handleSubmit = async (data: CreateConvidadoRequest) => {
        if (selectedConvidado) {
            await updateConvidado(selectedConvidado.id, data);
        } else {
            await createConvidado(data);
        }
        setIsModalOpen(false);
        setSelectedConvidado(undefined);
    };

    const openEdit = (convidado: Convidado) => {
        setSelectedConvidado(convidado);
        setIsModalOpen(true);
    };

    const openNew = () => {
        setSelectedConvidado(undefined);
        setIsModalOpen(true);
    };

    const buildGuestLink = (codigo: string) =>
        `${window.location.origin}/convidado/${codigo}`;

    const copyCode = (codigo: string) => {
        navigator.clipboard.writeText(codigo);
        toast.success("Código copiado!");
    };

    const copyLink = (codigo: string) => {
        navigator.clipboard.writeText(buildGuestLink(codigo));
        toast.success("Link copiado!");
        setShareMenuId(null);
    };

    const shareWhatsApp = (convidado: Convidado) => {
        const link = buildGuestLink(convidado.codigo_unico);
        const msg = `Oi, ${convidado.nome}! 🎀 Que alegria ter você no nosso evento! Acesse pelo link abaixo para confirmar presença e dar uma espiadinha na lista de presentes 😍\n${link}\n\nMal podemos esperar para te ver! 💕`;
        const phone = convidado.telefone?.replace(/\D/g, "");
        const url = phone
            ? `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`
            : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
        window.open(url, "_blank", "noopener,noreferrer");
        setShareMenuId(null);
    };

    const shareEmail = (convidado: Convidado) => {
        const link = buildGuestLink(convidado.codigo_unico);
        const nome = convidado.nome.split(" ")[0];
        const subject = encodeURIComponent("Seu acesso exclusivo ao nosso evento 💕");
        const body = encodeURIComponent(
            `Olá, ${nome}!\n\nAcesse sua área exclusiva do nosso evento pelo link abaixo:\n${link}\n\nCom ele você pode confirmar presença, ver a lista de presentes e deixar uma mensagem.\n\nAté breve! 🎉`
        );
        const to = convidado.email ? encodeURIComponent(convidado.email) : "";
        window.open(`mailto:${to}?subject=${subject}&body=${body}`, "_self");
        setShareMenuId(null);
    };

    const getInitials = (nome: string) =>
        nome.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

    const filtered = convidados.filter((c) => {
        const q = search.toLowerCase();
        return (
            c.nome.toLowerCase().includes(q) ||
            c.codigo_unico.toLowerCase().includes(q) ||
            (c.email ?? "").toLowerCase().includes(q) ||
            (c.telefone ?? "").toLowerCase().includes(q)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const currentPage = Math.min(page, totalPages);
    const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

    const totalConfirmados = convidados.filter((c) => confirmadosIds.has(c.id)).length;

    return (
        <div className="space-y-6">
            {/* Cabeçalho + stats */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                    <div className="card px-5 py-3 flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary-100">
                            <Users className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total</p>
                            <p className="text-lg font-bold text-gray-800">{convidados.length}</p>
                        </div>
                    </div>
                    <div className="card px-5 py-3 flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-100">
                            <UserCheck className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Confirmados</p>
                            <p className="text-lg font-bold text-green-700">{totalConfirmados}</p>
                        </div>
                    </div>
                </div>
                <button onClick={openNew} className="btn-primary flex items-center gap-2 self-start sm:self-auto">
                    <Plus className="w-4 h-4" />
                    Novo Convidado
                </button>
            </div>

            {/* Busca */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por nome, código, email..."
                    className="input-field pl-9 pr-9"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
                {search && (
                    <button
                        onClick={() => { setSearch(""); setPage(1); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Lista */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                        {search ? `Nenhum convidado encontrado para "${search}"` : "Nenhum convidado cadastrado"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paginated.map((convidado) => {
                        const confirmado = confirmadosIds.has(convidado.id);
                        const isLoading = loadingConvidadoId === convidado.id;

                        return (
                            <div
                                key={convidado.id}
                                className={`card p-5 flex flex-col gap-4 ${confirmado ? "border-green-200" : ""}`}
                            >
                                {/* Topo: avatar + nome + badge */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-sm font-bold shadow">
                                            {getInitials(convidado.nome)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 leading-tight">
                                                {convidado.nome}
                                            </p>
                                            {convidado.guest_of && (
                                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary-50 text-secondary-700 border border-secondary-100">
                                                    <UserCircle2 className="w-3 h-3" />
                                                    {convidado.guest_of}
                                                </span>
                                            )}
                                            {(convidado.email || convidado.telefone) && (
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {convidado.email || convidado.telefone}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {confirmado && (
                                        <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Confirmado
                                        </span>
                                    )}
                                </div>

                                {/* Código + Compartilhar */}
                                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-50 border border-primary-100">
                                    <code className="flex-1 font-mono text-sm font-semibold text-primary-700 tracking-wide truncate">
                                        {convidado.codigo_unico}
                                    </code>
                                    <button
                                        onClick={() => copyCode(convidado.codigo_unico)}
                                        className="p-1 rounded-lg text-primary-500 hover:text-primary-700 hover:bg-primary-100 transition-colors"
                                        title="Copiar código"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    {/* Botão compartilhar com dropdown */}
                                    <div className="relative" ref={shareMenuId === convidado.id ? shareMenuRef : undefined}>
                                        <button
                                            onClick={() => setShareMenuId(shareMenuId === convidado.id ? null : convidado.id)}
                                            className="p-1 rounded-lg text-primary-500 hover:text-primary-700 hover:bg-primary-100 transition-colors"
                                            title="Compartilhar link de acesso"
                                        >
                                            <Share2 className="w-3.5 h-3.5" />
                                        </button>
                                        {shareMenuId === convidado.id && (
                                            <div className="absolute right-0 top-7 z-20 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 text-sm">
                                                <button
                                                    onClick={() => copyLink(convidado.codigo_unico)}
                                                    className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <Link2 className="w-3.5 h-3.5 text-gray-400" />
                                                    Copiar link
                                                </button>
                                                <button
                                                    onClick={() => shareWhatsApp(convidado)}
                                                    className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-700 hover:bg-green-50 transition-colors"
                                                >
                                                    <MessageCircle className="w-3.5 h-3.5 text-green-500" />
                                                    WhatsApp
                                                </button>
                                                {convidado.email && (
                                                    <button
                                                        onClick={() => shareEmail(convidado)}
                                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                                                    >
                                                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                                                        E-mail
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Observações */}
                                {convidado.observacoes && (
                                    <p className="text-xs text-gray-500 italic">
                                        {convidado.observacoes}
                                    </p>
                                )}

                                {/* Ações */}
                                <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-100">
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Gerar novo código? O código atual ficará inválido.")) {
                                                await regenerarCodigo(convidado.id);
                                            }
                                        }}
                                        disabled={isLoading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-600 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                                        title="Regenerar código"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <RefreshCw className="w-3.5 h-3.5" />
                                        )}
                                        Novo código
                                    </button>
                                    <button
                                        onClick={() => openEdit(convidado)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm("Remover este convidado?")) {
                                                await deleteConvidado(convidado.id);
                                            }
                                        }}
                                        disabled={isLoading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Remover
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <p className="text-sm text-gray-500 text-center sm:text-left">
                        Mostrando{" "}
                        <span className="font-medium text-gray-700">
                            {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)}
                        </span>{" "}
                        de <span className="font-medium text-gray-700">{filtered.length}</span>
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Anterior
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                                    p === currentPage
                                        ? "bg-primary-500 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Próximo →
                        </button>
                    </div>
                </div>
            )}

            <ConvidadoModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedConvidado(undefined);
                }}
                onSubmit={handleSubmit}
                convidado={selectedConvidado}
                title={selectedConvidado ? "Editar Convidado" : "Novo Convidado"}
            />
        </div>
    );
};

export default AdminConvidados;
