import { describe, expect, it } from "vitest";
import { formatCurrency, formatDateOnly } from "../../utils/format";

describe("formatCurrency", () => {
    it("formata valores em reais", () => {
        expect(formatCurrency(100)).toContain("100");
        expect(formatCurrency(100)).toContain("R$");
    });

    it("formata zero corretamente", () => {
        expect(formatCurrency(0)).toContain("0");
    });

    it("formata valores decimais", () => {
        const result = formatCurrency(1234.56);
        expect(result).toContain("1.234");
        expect(result).toContain("56");
    });
});

describe("formatDateOnly", () => {
    it("não perde um dia por causa do fuso horário (new Date('YYYY-MM-DD') vira UTC)", () => {
        // new Date("2026-11-01").toLocaleDateString("pt-BR") em fusos atrás
        // de UTC (ex: America/Sao_Paulo) mostraria "31 de outubro" — bug que
        // formatDateOnly evita ao construir a data no fuso local.
        const result = formatDateOnly("2026-11-01");
        expect(result).toContain("01");
        expect(result).toContain("novembro");
        expect(result).not.toContain("outubro");
    });

    it("formata corretamente o primeiro dia do ano", () => {
        const result = formatDateOnly("2026-01-01");
        expect(result).toContain("01");
        expect(result).toContain("janeiro");
    });

    it("formata corretamente o último dia do ano", () => {
        const result = formatDateOnly("2026-12-31");
        expect(result).toContain("31");
        expect(result).toContain("dezembro");
    });
});
