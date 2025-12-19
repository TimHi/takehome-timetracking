import { useState, useEffect, useCallback } from 'react';
import type { JsWorkDay } from 'shared';
import { useWorkDays } from '../hooks/useWorkDays';
//TODO_THL: Naming
export function useWeeklyWorkDays(initialOffset = 0) {
    const server = useWorkDays();

    const [weekOffset, setWeekOffset] = useState(initialOffset);
    const [workDays, setWorkDays] = useState<JsWorkDay[]>([]);
    const [weekLabel, setWeekLabel] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchWeekData = useCallback(async (offset: number) => {
        setLoading(true);
        try {
            const [days, label] = await Promise.all([
                server.fetchWeek(offset),
                server.getWeekLabel(offset),
            ]);
            setWorkDays(days);
            setWeekLabel(label);
        } finally {
            setLoading(false);
        }
    }, [server]);

    useEffect(() => {
        fetchWeekData(weekOffset);
    }, [weekOffset, fetchWeekData]);

    const prevWeek = () => setWeekOffset((prev) => prev - 1);
    const nextWeek = () => setWeekOffset((prev) => prev + 1);

    return {
        workDays,
        weekLabel,
        loading,
        prevWeek,
        nextWeek,
        jumpToToday: () => setWeekOffset(0),
    };
}
