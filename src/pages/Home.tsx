import {
    Calendar,
    Clock,
    ExternalLink,
    Gift,
    Heart,
    MapPin,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventoApi } from "../services/api";
import { useConvidado } from "../contexts/ConvidadoContext";
import type { EventoInfo } from "../types";

interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const Home = () => {
    const [eventoInfo, setEventoInfo] = useState<EventoInfo | null>(null);
    const { convidado } = useConvidado();
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState<Countdown | null>(null);
    const [eventoPassou, setEventoPassou] = useState(false);

    useEffect(() => {
        loadEventoInfo();
    }, []);

    useEffect(() => {
        if (!eventoInfo?.data || !eventoInfo?.horario) return;

        const eventDate = new Date(`${eventoInfo.data}T${eventoInfo.horario}`);

        const update = () => {
            const diff = eventDate.getTime() - Date.now();
            if (diff <= 0) {
                setEventoPassou(true);
                setCountdown(null);
                return;
            }
            setCountdown({
                days: Math.floor(diff / 86400000),
                hours: Math.floor((diff % 86400000) / 3600000),
                minutes: Math.floor((diff % 3600000) / 60000),
                seconds: Math.floor((diff % 60000) / 1000),
            });
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [eventoInfo]);

    const loadEventoInfo = async () => {
        try {
            const data = await eventoApi.getEventoInfo();
            setEventoInfo(data);
        } catch (err) {
            console.error("Erro ao carregar informações do evento:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (data: string) =>
        new Date(data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });

    const formatarHorario = (horario: string) => {
        const [hora, minuto] = horario.split(":");
        return `${hora}h${minuto}`;
    };

    const pad = (n: number) => String(n).padStart(2, "0");

    const buildMapEmbedUrl = () => {
        if (!eventoInfo) return null;
        // Tenta extrair coordenadas do link do Google Maps (formato /@lat,lng)
        const coordMatch = eventoInfo.local_maps_url?.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch) {
            const [, lat, lng] = coordMatch;
            return `https://maps.google.com/maps?ll=${lat},${lng}&q=${lat},${lng}&z=17&output=embed`;
        }
        // Fallback: busca pelo endereço
        if (eventoInfo.local) {
            return `https://maps.google.com/maps?q=${encodeURIComponent(eventoInfo.local)}&output=embed&z=16`;
        }
        return null;
    };
    const mapEmbedUrl = buildMapEmbedUrl();

    return (
        <div className="min-h-screen py-8">
            {/* Hero Photo */}
            {!loading && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                    <div className="flex flex-col items-center md:flex-row md:items-stretch gap-0 rounded-3xl overflow-hidden shadow-xl">
                        {/* Foto — respeita proporção quadrada */}
                        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[420px] flex-shrink-0">
                            <img
                                src={eventoInfo?.foto_casal_url || "/foto-casal.jpg"}
                                alt="Cristian & Flavia"
                                className="w-full h-full object-cover object-center"
                            />
                        </div>
                        {/* Painel lateral */}
                        <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-500 to-secondary-500 flex flex-col items-center justify-center px-8 py-10 text-white text-center">
                            <p className="font-serif text-3xl md:text-4xl font-bold drop-shadow mb-3">
                                Chá de Casa Nova
                            </p>
                            <p className="text-xl md:text-2xl opacity-90 font-script">
                                Cristian & Flavia
                            </p>
                            <p className="text-3xl mt-2">💕</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-10">
                        <div className="space-y-4 mb-8">
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slideUp">
                                Estamos construindo nosso cantinho de amor e
                                queremos compartilhar essa alegria com pessoas
                                especiais como você! 💕
                            </p>
                        </div>

                        {/* Data + Countdown */}
                        <div className="card-romantic max-w-lg mx-auto p-6 mb-8 animate-slideUp">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <Calendar className="h-5 w-5 text-romantic-gold" />
                                <span className="font-serif text-lg font-medium">
                                    Data do Evento
                                </span>
                            </div>
                            {loading ? (
                                <div className="animate-pulse space-y-3">
                                    <div className="h-8 bg-gray-200 rounded w-48 mx-auto" />
                                    <div className="h-12 bg-gray-200 rounded w-full" />
                                </div>
                            ) : convidado && eventoInfo?.data ? (
                                <>
                                    <p className="text-2xl font-bold text-primary-600 font-serif">
                                        {formatarData(eventoInfo.data)}
                                    </p>
                                    <p className="text-gray-600 mt-1">
                                        às {formatarHorario(eventoInfo.horario)}
                                    </p>

                                    {/* Countdown */}
                                    {eventoPassou ? (
                                        <p className="mt-4 text-primary-500 font-medium">
                                            🎉 O evento já aconteceu!
                                        </p>
                                    ) : countdown ? (
                                        <div className="mt-5 grid grid-cols-4 gap-2">
                                            {[
                                                { label: "Dias", value: countdown.days },
                                                { label: "Horas", value: countdown.hours },
                                                { label: "Min", value: countdown.minutes },
                                                { label: "Seg", value: countdown.seconds },
                                            ].map(({ label, value }) => (
                                                <div
                                                    key={label}
                                                    className="bg-primary-50 rounded-xl py-2 px-1 text-center"
                                                >
                                                    <p className="text-2xl font-bold text-primary-600 font-mono tabular-nums">
                                                        {pad(value)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    <p className="text-2xl font-bold text-primary-600 font-serif">
                                        Em Breve!
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        Aguarde mais informações sobre quando
                                        será nossa celebração
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Call to Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
                            <Link
                                to="/convidado"
                                className="btn-primary inline-flex items-center space-x-2"
                            >
                                <Gift className="h-5 w-5" />
                                <span>Área do Convidado</span>
                            </Link>
                            <Link
                                to="/convidado"
                                className="btn-secondary inline-flex items-center space-x-2"
                            >
                                <Heart className="h-5 w-5" />
                                <span>Acessar com Código</span>
                            </Link>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600 max-w-lg mx-auto">
                                Para acessar a lista de presentes, mensagens e confirmação,
                                você precisa inserir seu código de convidado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Informações do Evento */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Localização */}
                        <div className="card text-center p-6">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MapPin className="h-6 w-6 text-primary-600" />
                            </div>
                            <h3 className="font-serif text-xl font-semibold mb-2">
                                Local
                            </h3>
                            {loading ? (
                                <div className="animate-pulse space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                                </div>
                            ) : convidado && eventoInfo?.local ? (
                                <>
                                    <p className="text-gray-600 whitespace-pre-line">
                                        {eventoInfo.local}
                                    </p>
                                    {eventoInfo.local_maps_url && (
                                        <a
                                            href={eventoInfo.local_maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center mt-2"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-1" />
                                            Ver no Google Maps
                                        </a>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-600">
                                    Informações do local
                                    <br />
                                    serão divulgadas em breve
                                </p>
                            )}
                        </div>

                        {/* Horário */}
                        <div className="card text-center p-6">
                            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="h-6 w-6 text-secondary-600" />
                            </div>
                            <h3 className="font-serif text-xl font-semibold mb-2">
                                Horário
                            </h3>
                            {loading ? (
                                <div className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                                </div>
                            ) : convidado && eventoInfo?.horario ? (
                                <p className="text-gray-600">
                                    {formatarHorario(eventoInfo.horario)}
                                </p>
                            ) : (
                                <p className="text-gray-600">
                                    A definir
                                    <br />
                                    Aguarde mais informações
                                </p>
                            )}
                        </div>

                        {/* Traje */}
                        <div className="card text-center p-6">
                            <div className="w-12 h-12 bg-romantic-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="h-6 w-6 text-romantic-gold" />
                            </div>
                            <h3 className="font-serif text-xl font-semibold mb-2">
                                Traje
                            </h3>
                            <p className="text-gray-600">
                                Venha confortável
                                <br />e com muito amor! 💕
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mapa */}
            {convidado && mapEmbedUrl && (
                <section className="pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="font-serif text-2xl font-bold text-center text-gray-900 mb-6">
                            Como Chegar
                        </h2>
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            <iframe
                                src={mapEmbedUrl}
                                width="100%"
                                height="360"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localização do evento"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Como Funciona */}
            <section className="py-16 bg-white/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
                            Como Funciona?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            É muito simples ajudar a mobiliar nosso novo lar!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                1
                            </div>
                            <h3 className="font-serif text-xl font-semibold mb-2">
                                Escolha um Presente
                            </h3>
                            <p className="text-gray-600">
                                Navegue pela nossa lista e escolha um item que
                                gostaria de nos presentear
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                2
                            </div>
                            <h3 className="font-serif text-xl font-semibold mb-2">
                                Resgate o Item
                            </h3>
                            <p className="text-gray-600">
                                Clique em "Reservar" e deixe seu nome para
                                reservar o presente
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-romantic-gold to-romantic-dusty rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                                3
                            </div>
                            <h3 className="font-serif text-xl font-semibold mb-2">
                                Leve no Evento
                            </h3>
                            <p className="text-gray-600">
                                Compre o item e traga no dia da nossa
                                celebração!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mensagem Final */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="card-romantic p-8">
                        <h2 className="font-serif text-2xl font-bold text-primary-600 mb-4">
                            Obrigado por Fazer Parte da Nossa História! 💕
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Cada presente, cada mensagem e cada gesto de carinho
                            será guardado para sempre em nossos corações. Vocês
                            são parte fundamental da construção do nosso lar e
                            da nossa felicidade!
                        </p>
                        <p className="text-xl font-script text-romantic-gold mt-4">
                            Com amor, Cristian & Flavia
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/mensagens"
                                className="btn-romantic inline-flex items-center space-x-2"
                            >
                                <Heart className="h-5 w-5" />
                                <span>Deixar uma Mensagem</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
