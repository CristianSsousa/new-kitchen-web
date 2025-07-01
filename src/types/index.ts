export interface Item {
    id: number;
    nome: string;
    descricao: string;
    categoria: string;
    preco: number;
    imagem_url: string;
    link_url?: string;
    resgatado: boolean;
    resgatado_por?: string;
    resgatado_em?: string;
    criado_em: string;
    atualizado_em: string;
}

export interface Mensagem {
    id: number;
    nome: string;
    mensagem: string;
    aprovada: boolean;
    criada_em: string;
    atualizada_em: string;
}

export interface Confirmacao {
    id: number;
    nome: string;
    quantidade_adultos: number;
    quantidade_criancas: number;
    criada_em: string;
}

export interface Stats {
    total_itens: number;
    itens_resgatados: number;
    total_mensagens: number;
    total_convidados: number;
    porcentagem_concluida: number;
}

export interface Estatisticas {
    total_itens: number;
    itens_resgatados: number;
    total_mensagens: number;
    total_convidados: number;
    porcentagem_concluida: number;
}

export interface EstatisticasDetalhadas {
    total_itens: number;
    itens_resgatados: number;
    total_mensagens: number;
    total_convidados: number;
    total_confirmacoes: number;
    valor_total_itens: number;
    porcentagem_concluida: number;
    mensagens_pendentes: number;
    categorias: CategoriaStats[];
}

export interface CategoriaStats {
    categoria: string;
    total: number;
    resgatados: number;
    porcentagem: number;
}

export interface PrioridadeStats {
    prioridade: number;
    nome: string;
    total: number;
    resgatados: number;
    porcentagem: number;
}

export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
}

export interface ResgatarItemRequest {
    resgatado_por: string;
}

export interface CreateItemRequest {
    nome: string;
    descricao: string;
    categoria: string;
    preco: number;
    imagem_url: string;
    link_url?: string;
}

export interface CreateMensagemRequest {
    nome: string;
    mensagem: string;
}

export interface CreateConfirmacaoRequest {
    nome: string;
    quantidade_adultos: number;
    quantidade_criancas: number;
}

export type PrioridadeName = "Baixa" | "Média" | "Alta";
export type CategoriasDisponiveis =
    | "Cozinha"
    | "Quarto"
    | "Sala"
    | "Banheiro"
    | "Mesa & Banho"
    | "Eletrodomésticos"
    | "Limpeza"
    | "Decoração"
    | "Outros";

export const CATEGORIAS: CategoriasDisponiveis[] = [
    "Cozinha",
    "Quarto",
    "Sala",
    "Banheiro",
    "Mesa & Banho",
    "Eletrodomésticos",
    "Limpeza",
    "Decoração",
    "Outros",
];

export const PRIORIDADES: Record<number, PrioridadeName> = {
    1: "Baixa",
    2: "Média",
    3: "Alta",
};

export const CORES_PRIORIDADE: Record<number, string> = {
    1: "priority-low",
    2: "priority-medium",
    3: "priority-high",
};

export interface EventoInfo {
    data: string;
    horario: string;
    local: string;
    local_maps_url?: string;
    updated_at: string;
}

export interface UpdateEventoRequest {
    data: string;
    horario: string;
    local: string;
    local_maps_url?: string;
}
