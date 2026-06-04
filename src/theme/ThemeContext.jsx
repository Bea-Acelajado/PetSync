import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const storageKey = "petsync-mode";

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.localStorage.getItem(storageKey) || "light";
  });

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    window.localStorage.setItem(storageKey, mode);
  }, [mode]);

  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
