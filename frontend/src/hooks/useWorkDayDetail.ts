import { useState, useCallback } from 'react';
import type { JsWorkDay } from 'shared';
import { useWorkDays } from '../hooks/useWorkDays';

export function useWorkDayDetail() {
    const server = useWorkDays();

    const [workDay, setWorkDay] = useState<JsWorkDay | null>(null);

    const [loading, setLoading] = useState(false);

    const fetchWeekDay = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const workDay = await server.getById(id);

            if (workDay !== undefined && workDay !== null) {
                console.log(workDay);
                const r = await server.validateWorkDay(workDay);
                console.log(r);
            }
            setWorkDay(workDay);
        } finally {
            setLoading(false);
        }

    }, [server]);

    return {
        workDay,
        loading,
        fetchWeekDay,
    };
}