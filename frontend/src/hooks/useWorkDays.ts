import { useState, useEffect, useCallback } from "react";
import { workdayService } from "../services/workdayService";
import type { JsWorkDay } from "shared";

export function useWorkDays(initialOffset: number = 0) {
    const [weekWorkDays, setWeekWorkDays] = useState<JsWorkDay[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(initialOffset);

    // Fetch workdays for a specific week
    const fetchWeek = useCallback(async (weekOffset: number = offset) => {
        setLoading(true);
        try {
            const data = await workdayService.getWeek(weekOffset);
            setWeekWorkDays(data);
        } finally {
            setLoading(false);
        }
    }, [offset]);

    // Fetch current offset on mount / offset change
    useEffect(() => {
        fetchWeek(offset);
    }, [offset, fetchWeek]);

    // CRUD methods
    const upsert = useCallback(async (workDay: JsWorkDay) => {
        const updated = await workdayService.upsert(workDay);
        await fetchWeek(offset); // refresh current week
        return updated;
    }, [offset, fetchWeek]);

    const remove = useCallback(async (id: number) => {
        await workdayService.delete(id);
        await fetchWeek(offset); // refresh current week
    }, [offset, fetchWeek]);
    //TODO_THL: evaluate useCallback necessity for this file
    const getByDate = useCallback((date: string) => {
        return workdayService.getByDate(date);
    }, []);

    const getById = useCallback((id: number) => {
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

    return {
        listAll,
        weekWorkDays,
        loading,
        offset,
        setOffset,
        fetchWeek,
        upsert,
        remove,
        getByDate,
        getById,
    };
}
