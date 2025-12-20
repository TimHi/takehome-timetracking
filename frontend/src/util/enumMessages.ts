const TIME_RANGE_TYPE_LABELS: Record<string, string> = {
	WORK: 'Arbeit',
	BREAK: 'Pause',
};

const WORK_DAY_VALIDATION_MESSAGES: Record<string, string> = {
	EMPTY_TIME_RANGE: 'Bitte mindestens einen Zeitraum erfassen.',
	END_BEFORE_START: 'Das Ende muss nach dem Beginn liegen.',
	MAX_WORK_TIME_EXCEEDED: 'Die maximale Arbeitszeit wurde überschritten.',
	BREAK_TOO_SHORT: 'Die Pause ist zu kurz.',
	INSUFFICIENT_BREAK_TIME: 'Die Pausenzeit ist zu kurz.',
	TIME_RANGES_OVERLAP: 'Zeitbereiche überschneiden sich.',
	EMPTY_WORK_TIME: 'Die Arbeitszeit darf nicht leer sein.',
};

export const toTimeRangeTypeLabel = (value: string) =>
	TIME_RANGE_TYPE_LABELS[value] ?? value;

export const toWorkDayValidationMessage = (
	value: string | null | undefined
) => {
	if (!value) return null;
	return WORK_DAY_VALIDATION_MESSAGES[value] ?? value;
};
