import { AxiosError } from "axios";
import toast from "react-hot-toast";
import type { ApiErrorResponse } from "../types";

export const getErrorMessage = (err: unknown, fallback: string): string => {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    if (axiosErr?.response?.data?.error) return axiosErr.response.data.error;
    if (err instanceof Error) return err.message;
    return fallback;
};

export const handleApiError = (err: unknown, fallback: string): string => {
    const message = getErrorMessage(err, fallback);
    toast.error(message);
    return message;
};
