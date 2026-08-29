export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
};

// Recebe uma data no formato "YYYY-MM-DD" (sem horário, ex: valor de <input
// type="date"> ou da API) e formata usando o dia local, sem passar por UTC.
// new Date("YYYY-MM-DD") interpreta a string como meia-noite UTC — em fusos
// atrás de UTC (como o Brasil) isso exibe o dia anterior.
export const formatDateOnly = (
    data: string,
    options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }
): string => {
    const [year, month, day] = data.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("pt-BR", options);
};
