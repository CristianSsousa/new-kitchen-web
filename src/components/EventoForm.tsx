import { Calendar, Clock, Image, MapPin, Plus, UserCircle2, X as XIcon } from "lucide-react";
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
        foto_casal_url: "",
        hosts: [],
    });
    const [newHost, setNewHost] = useState("");

    useEffect(() => {
        loadEventoInfo();
    }, []);

    const loadEventoInfo = async () => {
        try {
            setLoading(true);
            const data = await eventoApi.getEventoInfo();
            setFormData({
                data: data.data || "",
                horario: data.horario || "",
                local: data.local || "",
                local_maps_url: data.local_maps_url || "",
                foto_casal_url: data.foto_casal_url || "",
                hosts: data.hosts || [],
            });
        } catch (err) {
            toast.error("Erro ao carregar informações do evento");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await eventoApi.updateEventoInfo(formData);
            toast.success("Informações do evento atualizadas com sucesso!");
        } catch (err) {
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
                    <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span>Link do Google Maps</span>
                    </div>
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
                    Opcional: link para abrir no Google Maps
                </p>
            </div>

            {/* Foto do Casal */}
            <div>
                <label
                    htmlFor="foto_casal_url"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    <div className="flex items-center space-x-2">
                        <Image className="h-5 w-5 text-gray-400" />
                        <span>Foto do Casal / Casa</span>
                    </div>
                </label>
                <input
                    type="url"
                    id="foto_casal_url"
                    value={formData.foto_casal_url}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            foto_casal_url: e.target.value,
                        })
                    }
                    className="input-field"
                    placeholder="URL da foto (ex: https://...)"
                />
                <p className="mt-1 text-sm text-gray-500">
                    Opcional: foto exibida no topo da página inicial
                </p>
                {formData.foto_casal_url && (
                    <img
                        src={formData.foto_casal_url}
                        alt="Preview"
                        className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-200"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                )}
            </div>

            {/* Donos da Festa */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center space-x-2">
                        <UserCircle2 className="h-5 w-5 text-gray-400" />
                        <span>Donos da Festa</span>
                    </div>
                </label>
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={newHost}
                        onChange={(e) => setNewHost(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                const name = newHost.trim();
                                if (name && !(formData.hosts ?? []).includes(name)) {
                                    setFormData({ ...formData, hosts: [...(formData.hosts ?? []), name] });
                                    setNewHost("");
                                }
                            }
                        }}
                        className="input-field flex-1"
                        placeholder="Nome do dono da festa"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            const name = newHost.trim();
                            if (name && !(formData.hosts ?? []).includes(name)) {
                                setFormData({ ...formData, hosts: [...(formData.hosts ?? []), name] });
                                setNewHost("");
                            }
                        }}
                        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar
                    </button>
                </div>
                {(formData.hosts ?? []).length > 0 && (
                    <ul className="space-y-2">
                        {(formData.hosts ?? []).map((host) => (
                            <li
                                key={host}
                                className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 border border-gray-200"
                            >
                                <span className="text-sm text-gray-800">{host}</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            hosts: (formData.hosts ?? []).filter((h) => h !== host),
                                        })
                                    }
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    aria-label={`Remover ${host}`}
                                >
                                    <XIcon className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <p className="mt-1 text-sm text-gray-500">
                    Opcional: nomes usados para identificar de qual dono cada convidado pertence
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
