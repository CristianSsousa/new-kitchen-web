import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { AuthProvider, useAuth } from "../../contexts/AuthContext";
import * as api from "../../services/api";

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
);

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it("inicia sem autenticação quando localStorage está vazio", () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.token).toBeNull();
    });

    it("retorna false para senha incorreta", async () => {
        vi.spyOn(api.authApi, "login").mockResolvedValue(false);
        const { result } = renderHook(() => useAuth(), { wrapper });
        let ok: boolean;
        await act(async () => {
            ok = await result.current.login("senha_errada");
        });
        expect(ok!).toBe(false);
        expect(result.current.isAuthenticated).toBe(false);
    });

    it("autentica com a senha correta", async () => {
        vi.spyOn(api.authApi, "login").mockResolvedValue(true);
        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => {
            await result.current.login("senha_correta");
        });
        expect(result.current.isAuthenticated).toBe(true);
    });

    it("desloga e limpa o estado", async () => {
        vi.spyOn(api.authApi, "login").mockResolvedValue(true);
        const { result } = renderHook(() => useAuth(), { wrapper });
        await act(async () => {
            await result.current.login("senha_correta");
        });
        act(() => {
            result.current.logout();
        });
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.token).toBeNull();
        expect(localStorage.getItem("adminToken")).toBeNull();
    });

    it("persiste a sessão via localStorage", () => {
        localStorage.setItem("adminToken", "token_persistido");
        const { result } = renderHook(() => useAuth(), { wrapper });
        expect(result.current.isAuthenticated).toBe(true);
    });
});
