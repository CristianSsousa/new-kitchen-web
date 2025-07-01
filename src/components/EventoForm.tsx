import { Calendar, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { eventoApi } from "../services/api";
import type { UpdateEventoRequest } from "../types";

const EventoForm = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<UpdateEventoRequest>({
        data: "",
        horario: "",
        local: "",
        local_maps_url: "",
    });

    useEffect(() => {
        loadEventoInfo();
    }, []);

    const loadEventoInfo = async () => {
        try {
            setLoading(true);
            console.log("Carregando informações do evento...");
            const data = await eventoApi.getEventoInfo();
            console.log("Informações do evento recebidas:", data);
            setFormData({
                data: data.data || "",
                horario: data.horario || "",
                local: data.local || "",
                local_maps_url: data.local_maps_url || "",
            });
        } catch (err) {
            console.error("Erro ao carregar informações do evento:", err);
            toast.error("Erro ao carregar informações do evento");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            console.log("Enviando dados do evento:", formData);
            await eventoApi.updateEventoInfo(formData);
            console.log("Informações do evento atualizadas com sucesso!");
            toast.success("Informações do evento atualizadas com sucesso!");
        } catch (err) {
            console.error("Erro ao atualizar informações do evento:", err);
            toast.error("Erro ao atualizar informações do evento");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data */}
                <div>
                    <label
                        htmlFor="data"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span>Data do Evento</span>
                        </div>
                    </label>
                    <input
                        type="date"
                        id="data"
                        value={formData.data}
                        onChange={(e) =>
                            setFormData({ ...formData, data: e.target.value })
                        }
                        className="input-field"
                        required
                    />
                </div>

                {/* Horário */}
                <div>
                    <label
                        htmlFor="horario"
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        <div className="flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <span>Horário</span>
                        </div>
                    </label>
                    <input
                        type="time"
                        id="horario"
                        value={formData.horario}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                horario: e.target.value,
                            })
                        }
                        className="input-field"
                        required
                    />
                </div>
            </div>

            {/* Local */}
            <div>
                <label
                    htmlFor="local"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span>Local do Evento</span>
                    </div>
                </label>
                <textarea
                    id="local"
                    value={formData.local}
                    onChange={(e) =>
                        setFormData({ ...formData, local: e.target.value })
                    }
                    className="input-field"
                    rows={3}
                    placeholder="Digite o endereço completo do evento"
                    required
                />
            </div>

            {/* Link do Google Maps */}
            <div>
                <label
                    htmlFor="local_maps_url"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Link do Google Maps
                </label>
                <input
                    type="url"
                    id="local_maps_url"
                    value={formData.local_maps_url}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            local_maps_url: e.target.value,
                        })
                    }
                    className="input-field"
                    placeholder="Cole aqui o link do Google Maps"
                />
                <p className="mt-1 text-sm text-gray-500">
                    Opcional: Adicione um link do Google Maps para facilitar a
                    localização
                </p>
            </div>

            {/* Botão de Salvar */}
            <div className="flex justify-end">
                <button type="submit" disabled={saving} className="btn-primary">
                    {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
            </div>
        </form>
    );
};

export default EventoForm;
