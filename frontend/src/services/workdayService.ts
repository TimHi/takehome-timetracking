import type { JsWorkDay } from "shared";

const BASE_URL = "http://localhost:8080/api/workdays";

export const workdayService = {
    listAll: async (): Promise<JsWorkDay[]> => {
        const res = await fetch(`${BASE_URL}`);
        return res.json();
    },

    getByDate: async (date: string): Promise<JsWorkDay | null> => {
        const res = await fetch(`${BASE_URL}/by-date?date=${date}`);
        if (!res.ok) return null;
        return res.json();
    },

    getWeek: async (offset: number = 0): Promise<JsWorkDay[]> => {
        const res = await fetch(`${BASE_URL}/week?offset=${offset}`);
        return res.json();
    },

    getById: async (id: number): Promise<JsWorkDay | null> => {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) return null;
        return res.json();
    },

    // --- New CRUD methods ---
    upsert: async (workDay: JsWorkDay): Promise<JsWorkDay> => {
        const res = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workDay),
        });
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    },
};
