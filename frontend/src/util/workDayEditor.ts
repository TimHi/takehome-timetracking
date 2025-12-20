import type { JsTimeRange, JsWorkDay } from 'shared';

export const DEFAULT_TYPES = ['WORK', 'BREAK'];

export const toTimeValue = (isoString: string) => {
	const date = new Date(isoString);
	if (Number.isNaN(date.getTime())) return '';
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
};

export const toIsoString = (date: string, time: string) => {
	if (!date || !time) return '';
	const localDateTime = new Date(`${date}T${time}:00`);
	if (Number.isNaN(localDateTime.getTime())) return '';
	return localDateTime.toISOString();
};

export const buildTypeOptions = (workDay: JsWorkDay | null) => {
	if (!workDay) return DEFAULT_TYPES;
	const seen = new Set(DEFAULT_TYPES);
	workDay.timeRanges.forEach((range) => seen.add(range.type));
	return Array.from(seen);
};

export const updateWorkDayRange = (
	workDay: JsWorkDay | null,
	index: number,
	updater: (range: JsTimeRange, day: JsWorkDay) => JsTimeRange
) => {
	if (!workDay) return workDay;
	const nextRanges = workDay.timeRanges.map((range, i) =>
		i === index ? updater(range, workDay) : range
	);
	return workDay.copy(undefined, undefined, nextRanges);
};
