import type { JsWorkDay, JsWorkDayDurations } from "shared";

const BASE_URL = "http://localhost:8080/api/workdays";

const normalizeIsoString = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "value" in value) {
        const nested = (value as { value?: unknown }).value;
        if (typeof nested === "string") return nested;
    }
    return "";
};

const normalizeDate = (value: unknown): string => {
    const raw = normalizeIsoString(value);
    if (!raw) return "";
    return raw.includes("T") ? raw.split("T")[0] : raw;
};

const normalizeWorkDay = (workDay: JsWorkDay): JsWorkDay => ({
    ...workDay,
    date: normalizeDate(workDay.date),
    timeRanges: (workDay.timeRanges ?? []).map((range) => ({
        ...range,
        start: normalizeIsoString(range.start),
        end: normalizeIsoString(range.end),
    })),
});

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

    getById: async (id: string): Promise<JsWorkDay | null> => {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) return null;
        return res.json();
    },

    // --- New CRUD methods ---
    upsert: async (workDay: JsWorkDay): Promise<JsWorkDay> => {
        const payload = normalizeWorkDay(workDay);
        const res = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        return res.json();
    },

    delete: async (id: number): Promise<void> => {
        await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    },

    getWeekLabel: async (offset: number = 0): Promise<string> => {
        const res = await fetch(`${BASE_URL}/week-label?offset=${offset}`);
        return res.text();
    },

    validateWorkDay: async (workDay: JsWorkDay): Promise<ValidationResponse> => {
        try {
            const payload = normalizeWorkDay(workDay);
            const res = await fetch(`${BASE_URL}/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            return await res.json() as ValidationResponse;
        } catch (err) {
            console.error("Validation request failed", err);
            return { valid: false, error: "Validation request failed" };
        }
    },

    getDurations: async (id: string): Promise<JsWorkDayDurations | null> => {
        const res = await fetch(`${BASE_URL}/day-duration?id=${id}`);
        if (!res.ok) return null;
        return res.json();
    },
};

interface ValidationResponse {
    valid: boolean;
    error?: string;
}
