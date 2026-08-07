import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { websiteApi } from "../services";
import { errorMessage } from "../services/api";
import type { Website } from "../types";
import { useToast } from "./ToastContext";

interface WebsiteContextValue {
  websites: Website[];
  current: Website | null;
  loading: boolean;
  select: (id: number) => void;
  refresh: () => Promise<void>;
}

const WebsiteContext = createContext<WebsiteContextValue | undefined>(undefined);

export function WebsiteProvider({ children }: { children: ReactNode }) {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const res = await websiteApi.list();
      setWebsites(res.websites);
      if (currentId) {
        if (!res.websites.some((w) => w.id === currentId)) setCurrentId(null);
      } else if (res.websites.length > 0) {
        const stored = localStorage.getItem("wp_current_website");
        const found = stored ? res.websites.find((w) => w.id === Number(stored)) : undefined;
        setCurrentId(found ? found.id : res.websites[0].id);
      }
    } catch (e) {
      toast(errorMessage(e), "error");
    } finally {
      setLoading(false);
    }
  }, [currentId, toast]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = useCallback((id: number) => {
    setCurrentId(id);
    localStorage.setItem("wp_current_website", String(id));
  }, []);

  const current = websites.find((w) => w.id === currentId) ?? null;

  return (
    <WebsiteContext.Provider value={{ websites, current, loading, select, refresh }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite(): WebsiteContextValue {
  const ctx = useContext(WebsiteContext);
  if (!ctx) throw new Error("useWebsite must be used within WebsiteProvider");
  return ctx;
}