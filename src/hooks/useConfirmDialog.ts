import { useState } from "react";

export function useConfirmDialog<T>() {
    const [target, setTarget] = useState<T | null>(null);

    return {
        target,
        isOpen: target !== null,
        request: (value: T) => setTarget(value),
        cancel: () => setTarget(null),
    };
}
