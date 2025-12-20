import { JsTimeRange, JsWorkDay, type JsWorkDayDurations } from "shared";

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

type WorkDayPayload = {
    id: string | null;
    date: string;
    timeRanges: Array<{
        start: string;
        end: string;
        type: string;
    }>;
};

const normalizeWorkDay = (workDay: JsWorkDay): WorkDayPayload => ({
    id: workDay.id && workDay.id !== "0" ? workDay.id : null,
    date: normalizeDate(workDay.date),
    timeRanges: (workDay.timeRanges ?? []).map((range) => ({
        start: normalizeIsoString(range.start),
        end: normalizeIsoString(range.end),
        type: range.type,
    })),
});

const toJsWorkDay = (value: unknown): JsWorkDay | null => {
    if (!value || typeof value !== "object") return null;
    const raw = value as {
        id?: unknown;
        date?: unknown;
        timeRanges?: unknown;
    };

    const id = typeof raw.id === "number" ? raw.id : 0;
    const date = normalizeDate(raw.date);
    const ranges = Array.isArray(raw.timeRanges) ? raw.timeRanges : [];
    const timeRanges = ranges.map((range) => {
        const r = range as { start?: unknown; end?: unknown; type?: unknown };
        const start = normalizeIsoString(r.start);
        const end = normalizeIsoString(r.end);
        const type = typeof r.type === "string" ? r.type : "WORK";
        return new JsTimeRange(start, end, type);
    });

    return new JsWorkDay(id.toString(), date, timeRanges);
};

const toJsWorkDays = (value: unknown): JsWorkDay[] => {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => toJsWorkDay(item))
        .filter((item): item is JsWorkDay => item !== null);
};

export const workdayService = {
    listAll: async (): Promise<JsWorkDay[]> => {
        const res = await fetch(`${BASE_URL}`);
        return toJsWorkDays(await res.json());
    },

    getByDate: async (date: string): Promise<JsWorkDay | null> => {
        const res = await fetch(`${BASE_URL}/by-date?date=${date}`);
        if (!res.ok) return null;
        return toJsWorkDay(await res.json());
    },

    getWeek: async (offset: number = 0): Promise<JsWorkDay[]> => {
        const res = await fetch(`${BASE_URL}/week?offset=${offset}`);
        return toJsWorkDays(await res.json());
    },

    getById: async (id: string): Promise<JsWorkDay | null> => {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) return null;
        return toJsWorkDay(await res.json());
    },

    // --- New CRUD methods ---
    upsert: async (workDay: JsWorkDay): Promise<JsWorkDay> => {
        const payload = normalizeWorkDay(workDay);
        const res = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const result = toJsWorkDay(await res.json());
        if (!result) {
            return new JsWorkDay(workDay.id, workDay.date, workDay.timeRanges);
        }
        return result;
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
