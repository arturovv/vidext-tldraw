import { useCallback, useEffect, useRef } from "react";

export function useDebounce<Args extends unknown[]>(func: (...args: Args) => void, delay: number) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedFn = useCallback((...args: Args) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            func(...args);
            timeoutRef.current = null;
        }, delay);
    }, [func, delay]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedFn;
}