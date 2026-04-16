import { describe, expect, it, vi } from "vitest";
import { getErrorMessage } from "../../utils/errors";

vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));

describe("getErrorMessage", () => {
    it("extrai mensagem de um Error nativo", () => {
        const err = new Error("algo deu errado");
        expect(getErrorMessage(err, "fallback")).toBe("algo deu errado");
    });

    it("extrai mensagem de um AxiosError com response.data.error", () => {
        const axiosErr = {
            response: { data: { error: "não autorizado" } },
        };
        expect(getErrorMessage(axiosErr, "fallback")).toBe("não autorizado");
    });

    it("retorna fallback quando o erro não tem estrutura conhecida", () => {
        expect(getErrorMessage(null, "fallback padrão")).toBe("fallback padrão");
        expect(getErrorMessage({}, "outro fallback")).toBe("outro fallback");
    });

    it("retorna fallback quando response.data.error está ausente", () => {
        const axiosErr = { response: { data: {} } };
        expect(getErrorMessage(axiosErr, "fallback")).toBe("fallback");
    });
});
