"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "interview-tracly-theme";

function getStoredMode(): ThemeMode {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") return stored;
    return "system";
}

function getSystemPref(): "dark" | "light" {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getEffectiveTheme(mode: ThemeMode): "dark" | "light" {
    return mode === "system" ? getSystemPref() : mode;
}

function applyTheme(mode: ThemeMode) {
    const effective = getEffectiveTheme(mode);
    document.documentElement.classList.toggle("dark", effective === "dark");
}

function subscribeToSystemChanges(callback: () => void) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", callback);
    return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): ThemeMode {
    return getStoredMode();
}

function getServerSnapshot(): ThemeMode {
    return "system";
}

export function useTheme() {
    const mode = useSyncExternalStore(subscribeToThemeChanges, getSnapshot, getServerSnapshot);

    const effective = getEffectiveTheme(mode);
    const isDark = effective === "dark";

    useEffect(() => {
        applyTheme(mode);
    }, [mode]);

    const setMode = useCallback((m: ThemeMode) => {
        localStorage.setItem(STORAGE_KEY, m);
        applyTheme(m);
        window.dispatchEvent(new Event("storage"));
    }, []);

    const toggleTheme = useCallback(() => {
        const current = getEffectiveTheme(mode);
        const next: ThemeMode = current === "dark" ? "light" : "dark";
        setMode(next);
    }, [mode, setMode]);

    return { mode, effective, isDark, setMode, toggleTheme };
}

function subscribeToThemeChanges(callback: () => void) {
    const handler = () => callback();
    window.addEventListener("storage", handler);
    const unsub = subscribeToSystemChanges(handler);
    return () => {
        window.removeEventListener("storage", handler);
        unsub();
    };
}
