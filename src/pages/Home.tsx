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

const Home = () => {
    const [eventoInfo, setEventoInfo] = useState<EventoInfo | null>(null);
    const { convidado } = useConvidado();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEventoInfo();
    }, []);

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

    // Formatar data
    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };

    // Formatar horário
    const formatarHorario = (horario: string) => {
        const [hora, minuto] = horario.split(":");
        return `${hora}h${minuto}`;
    };

    return (
        <div className="min-h-screen py-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-20">
                        {/* Título Principal */}
                        <div className="space-y-4 mb-8">
                            <h1 className="title-romantic animate-fadeIn">
                                Chá de Casa Nova
                            </h1>
                            <p className="subtitle-romantic animate-slideUp">
                                Cristian & Flavia
                            </p>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slideUp">
                                Estamos construindo nosso cantinho de amor e
                                queremos compartilhar essa alegria com pessoas
                                especiais como você! 💕
                            </p>
                        </div>

                        {/* Contador ou Data */}
                        <div className="card-romantic max-w-md mx-auto p-6 mb-8 animate-slideUp">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                <Calendar className="h-5 w-5 text-romantic-gold" />
                                <span className="font-serif text-lg font-medium">
                                    Data do Evento
                                </span>
                            </div>
                            {loading ? (
                                <div className="animate-pulse">
                                    <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
                                </div>
                            ) : convidado && eventoInfo?.data ? (
                                <>
                                    <p className="text-2xl font-bold text-primary-600 font-serif">
                                        {formatarData(eventoInfo.data)}
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        às {formatarHorario(eventoInfo.horario)}
                                    </p>
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
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
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
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
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

                        {/* Dress Code */}
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
                                Clique em "Resgatar" e deixe seu nome para
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
