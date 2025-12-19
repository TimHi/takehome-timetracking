import { useState, useCallback } from 'react';
import type { JsWorkDay } from 'shared';
import { useWorkDays } from '../hooks/useWorkDays';

export function useWorkDayDetail() {
    const server = useWorkDays();

    const [workDay, setWorkDay] = useState<JsWorkDay | null>(null);


    const fetchWeekDay = useCallback(async (id: string) => {
        const workDay = await server.getById(id);
        setWorkDay(workDay);
    }, [server]);

    return {
        workDay,
        fetchWeekDay,

    };
}