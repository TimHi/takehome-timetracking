import { useCallback, useState } from 'react';
import type { JsWorkDayDurations } from 'shared';

export function useWorkDayDurations(
    workDayId: string | null,
    getWorkDayDuration: (id: string) => Promise<JsWorkDayDurations | null>
) {
    const [data, setData] = useState<JsWorkDayDurations | null>(null);

    const load = useCallback(async () => {
        if (!workDayId) return;

        const result = await getWorkDayDuration(workDayId);
        setData(result);
    }, [workDayId, getWorkDayDuration]);

    return { data, load };
}
