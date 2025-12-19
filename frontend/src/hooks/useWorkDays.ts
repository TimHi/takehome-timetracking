import { useState, useCallback, useMemo } from "react";
import { workdayService } from "../services/workdayService";
import type { JsWorkDay } from "shared";

export function useWorkDays(initialOffset: number = 0) {
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(initialOffset);

    // --- Fetch week ---
    const fetchWeek = useCallback(async (weekOffset: number): Promise<JsWorkDay[]> => {
        console.log("Fetching week with offset:", weekOffset);

        const r: JsWorkDay[] = await workdayService.getWeek(weekOffset);
        console.log(r);
        return r;

    }, []);

    // --- CRUD methods ---
    const upsert = useCallback(async (workDay: JsWorkDay): Promise<JsWorkDay> => {
        return workdayService.upsert(workDay);
    }, []);

    const remove = useCallback(async (id: number): Promise<void> => {
        await workdayService.delete(id);
    }, []);

    const getByDate = useCallback((date: string): Promise<JsWorkDay | null> => {
        return workdayService.getByDate(date);
    }, []);

    const getById = useCallback((id: number): Promise<JsWorkDay | null> => {
        return workdayService.getById(id);
    }, []);

    const listAll = useCallback(async (): Promise<JsWorkDay[]> => {
        setLoading(true);
        try {
            return await workdayService.listAll();
        } finally {
            setLoading(false);
        }
    }, []);

    const getWeekLabel = useCallback(async (weekOffset: number): Promise<string> => {
        return await workdayService.getWeekLabel(weekOffset);
    }, []);

    const validateWorkDay = useCallback(async (workDay: JsWorkDay): Promise<boolean> => {
        const response = await workdayService.varlidateWorkDay(workDay);
        return response.valid;
    }, []);

    // --- Stable return object ---
    return useMemo(
        () => ({
            validateWorkDay,
            listAll,
            loading,
            offset,
            setOffset,
            fetchWeek,
            upsert,
            remove,
            getByDate,
            getById,
            getWeekLabel
        }),
        [validateWorkDay, listAll, loading, offset, setOffset, fetchWeek, upsert, remove, getByDate, getById, getWeekLabel]
    );
}
