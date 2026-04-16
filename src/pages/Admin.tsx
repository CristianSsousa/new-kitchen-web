import {
    BarChart,
    Calendar,
    Gift,
    Key,
    MessageCircle,
    Users,
} from "lucide-react";
import { useState } from "react";
import AdminConfirmacoes from "../components/admin/AdminConfirmacoes";
import AdminConvidados from "../components/admin/AdminConvidados";
import AdminEstatisticas from "../components/admin/AdminEstatisticas";
import AdminItens from "../components/admin/AdminItens";
import AdminMensagens from "../components/admin/AdminMensagens";
import EventoForm from "../components/EventoForm";

type Tab = "itens" | "mensagens" | "confirmacoes" | "convidados" | "estatisticas" | "evento";

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
    { id: "itens", label: "Itens", Icon: Gift },
    { id: "mensagens", label: "Mensagens", Icon: MessageCircle },
    { id: "confirmacoes", label: "Confirmações", Icon: Users },
    { id: "convidados", label: "Convidados", Icon: Key },
    { id: "estatisticas", label: "Estatísticas", Icon: BarChart },
    { id: "evento", label: "Evento", Icon: Calendar },
];

const Admin = () => {
    const [activeTab, setActiveTab] = useState<Tab>("itens");

    return (
        <div className="px-4 py-8 min-h-screen sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Abas de navegação */}
                <div className="mb-8 flex justify-center">
                    <div className="max-w-full overflow-x-auto pb-1">
                    <div className="inline-flex flex-nowrap gap-2 p-1.5 bg-white/70 backdrop-blur-sm rounded-2xl border border-romantic-gold/20 shadow-sm min-w-max">
                        {TABS.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    activeTab === id
                                        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
                                        : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                    </div>
                </div>

                {/* Conteúdo */}
                <div>
                    {activeTab === "itens" && <AdminItens />}
                    {activeTab === "mensagens" && <AdminMensagens />}
                    {activeTab === "confirmacoes" && <AdminConfirmacoes />}
                    {activeTab === "convidados" && <AdminConvidados />}
                    {activeTab === "estatisticas" && <AdminEstatisticas />}
                    {activeTab === "evento" && <EventoForm />}
                </div>
            </div>
        </div>
    );
};

export default Admin;
