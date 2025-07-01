import axios from "axios";
import type {
    Confirmacao,
    CreateItemRequest,
    EstatisticasDetalhadas,
    EventoInfo,
    Item,
    Mensagem,
    ResgatarItemRequest,
    Stats,
    UpdateEventoRequest,
} from "../types";
const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1/";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
    const adminPassword = localStorage.getItem("adminPassword");
    if (adminPassword) {
        config.headers.Authorization = `Bearer ${adminPassword}`;
    }
    return config;
});

// ========== ITENS ==========
export const itemsApi = {
    // Obter todos os itens (admin)
    getItems: async (): Promise<Item[]> => {
        const response = await api.get("/admin/items");
        return response.data;
    },

    // Obter todos os itens (público)
    getPublicItems: async (): Promise<Item[]> => {
        const response = await api.get("/items");
        return response.data;
    },

    // Obter um item específico (admin)
    getItem: async (id: number): Promise<Item> => {
        const response = await api.get(`/admin/items/${id}`);
        return response.data;
    },

    // Criar um novo item (admin)
    createItem: async (item: CreateItemRequest): Promise<Item> => {
        const response = await api.post("/admin/items", item);
        return response.data;
    },

    // Atualizar um item (admin)
    updateItem: async (id: number, item: CreateItemRequest): Promise<Item> => {
        const response = await api.put(`/admin/items/${id}`, item);
        return response.data;
    },

    // Excluir um item (admin)
    deleteItem: async (id: number): Promise<void> => {
        await api.delete(`/admin/items/${id}`);
    },

    // Resgatar um item (público)
    resgateItem: async (
        id: number,
        data: ResgatarItemRequest
    ): Promise<Item> => {
        const response = await api.post(`/items/${id}/resgate`, data);
        return response.data;
    },

    // Cancelar resgate de um item (público)
    cancelaResgate: async (id: number): Promise<Item> => {
        const response = await api.post(`/items/${id}/cancela-resgate`);
        return response.data;
    },
};

// ========== MENSAGENS ==========
export const mensagensApi = {
    // Obter todas as mensagens (admin)
    getMensagens: async (): Promise<Mensagem[]> => {
        const response = await api.get("/admin/mensagens");
        return response.data;
    },

    // Obter mensagens aprovadas (público)
    getMensagensAprovadas: async (): Promise<Mensagem[]> => {
        const response = await api.get("/mensagens");
        return response.data;
    },

    // Criar uma nova mensagem (público)
    createMensagem: async (mensagem: {
        nome: string;
        mensagem: string;
    }): Promise<Mensagem> => {
        const response = await api.post("/mensagens", mensagem);
        return response.data;
    },

    // Aprovar uma mensagem (admin)
    aprovarMensagem: async (id: number): Promise<Mensagem> => {
        const response = await api.post(`/admin/mensagens/${id}/aprovar`);
        return response.data;
    },

    // Excluir uma mensagem (admin)
    deleteMensagem: async (id: number): Promise<void> => {
        await api.delete(`/admin/mensagens/${id}`);
    },
};

// ========== CONFIRMAÇÕES ==========
export const confirmacoesApi = {
    // Obter todas as confirmações (admin)
    getConfirmacoes: async (): Promise<Confirmacao[]> => {
        const response = await api.get("/admin/confirmacoes");
        return response.data;
    },

    // Criar uma nova confirmação (público)
    createConfirmacao: async (confirmacao: {
        nome: string;
        quantidade_adultos: number;
        quantidade_criancas: number;
    }): Promise<Confirmacao> => {
        const response = await api.post("/confirmacoes", confirmacao);
        return response.data;
    },

    // Atualizar uma confirmação (admin)
    updateConfirmacao: async (
        id: number,
        confirmacao: {
            nome: string;
            quantidade_adultos: number;
            quantidade_criancas: number;
        }
    ): Promise<Confirmacao> => {
        const response = await api.put(
            `/admin/confirmacoes/${id}`,
            confirmacao
        );
        return response.data;
    },

    // Excluir uma confirmação (admin)
    deleteConfirmacao: async (id: number): Promise<void> => {
        await api.delete(`/admin/confirmacoes/${id}`);
    },
};

// ========== ESTATÍSTICAS ==========
export const statsApi = {
    // Obter estatísticas básicas (público)
    getStats: async (): Promise<Stats> => {
        const response = await api.get("/stats");
        return response.data;
    },

    // Obter estatísticas detalhadas (admin)
    getEstatisticasDetalhadas: async (): Promise<EstatisticasDetalhadas> => {
        const response = await api.get("/admin/stats/detalhadas");
        return response.data;
    },
};

// ========== EVENTO ==========
export const eventoApi = {
    // Obter informações do evento (público)
    getEventoInfo: async (): Promise<EventoInfo> => {
        try {
            const response = await api.get("/evento");
            return response.data;
        } catch (error) {
            console.error("Erro ao obter informações do evento:", error);
            throw error;
        }
    },

    // Atualizar informações do evento (admin)
    updateEventoInfo: async (
        info: UpdateEventoRequest
    ): Promise<EventoInfo> => {
        try {
            const response = await api.put("/admin/evento", info);
            return response.data;
        } catch (error) {
            console.error("Erro ao atualizar informações do evento:", error);
            throw error;
        }
    },
};

export default api;
