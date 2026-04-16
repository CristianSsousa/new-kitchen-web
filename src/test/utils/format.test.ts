import { describe, expect, it } from "vitest";
import { formatCurrency } from "../../utils/format";

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
