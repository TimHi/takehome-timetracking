import { useCallback, useEffect, useState } from 'react';
import type { JsWorkDay } from 'shared';
import {
	JsTimeRange as JsTimeRangeCtor,
	JsWorkDay as JsWorkDayCtor,
} from 'shared';
import { useWorkDays } from './useWorkDays';

const toDateInputValue = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const createEmptyWorkDay = (date: string) =>
	new JsWorkDayCtor('', date, [new JsTimeRangeCtor('', '', 'WORK')]);

export const useWorkDayEditor = (id?: string) => {
	const { getById, upsert, validateWorkDay, remove } = useWorkDays();
	const [workDay, setWorkDay] = useState<JsWorkDay | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [validating, setValidating] = useState(false);
	const [isValid, setIsValid] = useState<boolean | null>(null);
	const [validationError, setValidationError] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			setError(null);

			if (!id) {
				setWorkDay(createEmptyWorkDay(toDateInputValue(new Date())));
				setIsValid(null);
				setLoading(false);
				return;
			}

			setLoading(true);
			try {
				const result = await getById(id);
				if (!active) return;
				setWorkDay(result);
				if (!result) setError('Arbeitstag nicht gefunden.');
			} catch (err) {
				console.error(err);
				if (active) setError('Arbeitstag konnte nicht geladen werden.');
			} finally {
				if (active) setLoading(false);
			}
		};

		load();
		return () => {
			active = false;
		};
	}, [getById, id]);

	useEffect(() => {
		if (!workDay) {
			setIsValid(null);
			setValidationError(null);
			return;
		}
		let active = true;
		setValidating(true);

		validateWorkDay(workDay)
			.then((response) => {
				if (!active) return;
				setIsValid(response.valid);
				setValidationError(response.error ?? null);
			})
			.catch((err) => {
				console.error(err);
				if (active) {
					setIsValid(false);
					setValidationError('Validierungsanfrage fehlgeschlagen.');
				}
			})
			.finally(() => {
				if (active) setValidating(false);
			});

		return () => {
			active = false;
		};
	}, [validateWorkDay, workDay]);

	const saveWorkDay = useCallback(async () => {
		if (!workDay) return null;

		setSaving(true);
		setError(null);
		try {
			return await upsert(workDay);
		} catch (err) {
			console.error(err);
			setError('Arbeitstag konnte nicht gespeichert werden.');
			return null;
		} finally {
			setSaving(false);
		}
	}, [upsert, workDay]);

	const deleteWorkDay = useCallback(
		async (workDayId: string) => {
			const numericId = Number(workDayId);
			if (!Number.isFinite(numericId)) {
				setError('Ungueltige Arbeitstag-ID.');
				return false;
			}

			setDeleting(true);
			setError(null);
			try {
				await remove(numericId);
				return true;
			} catch (err) {
				console.error(err);
				setError('Arbeitstag konnte nicht geloescht werden.');
				return false;
			} finally {
				setDeleting(false);
			}
		},
		[remove]
	);

	return {
		workDay,
		setWorkDay,
		loading,
		saving,
		deleting,
		validating,
		isValid,
		validationError,
		error,
		setError,
		saveWorkDay,
		deleteWorkDay,
	};
};
