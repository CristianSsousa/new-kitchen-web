import { describe, expect, it } from "vitest";
import { STORAGE_KEYS } from "../../constants/storage";

describe("STORAGE_KEYS", () => {
    it("define chave para token do admin", () => {
        expect(STORAGE_KEYS.ADMIN_TOKEN).toBe("adminToken");
    });

    it("define chave para código do convidado", () => {
        expect(STORAGE_KEYS.CONVIDADO_CODIGO).toBe("convidado_codigo");
    });
});
