import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	type ChangeEvent,
} from 'react';
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import type { JsTimeRange, JsWorkDay } from 'shared';
import {
	JsTimeRange as JsTimeRangeCtor,
	JsWorkDay as JsWorkDayCtor,
} from 'shared';
import { useWorkDays } from '../hooks/useWorkDays';
import { formatDate } from '../util/timeFormat';
import {
	buildTypeOptions,
	toIsoString,
	toTimeValue,
	updateWorkDayRange,
} from '../util/workDayEditor';
import AddTimeRange from '../components/AddTimeRange';
import TimeRangeFields from '../components/TimeRangeFields';
import TimeRangeTypeSelect from '../components/TimeRangeTypeSelect';

const toDateInputValue = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

const createEmptyWorkDay = (date: string) =>
	new JsWorkDayCtor('', date, [new JsTimeRangeCtor('', '', 'WORK')]);

const useWorkDayEditor = (id?: string) => {
	const { getById, upsert, validateWorkDay, remove } = useWorkDays();
	const [workDay, setWorkDay] = useState<JsWorkDay | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [validating, setValidating] = useState(false);
	const [isValid, setIsValid] = useState<boolean | null>(null);
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
				if (!result) setError('Workday not found.');
			} catch (err) {
				console.error(err);
				if (active) setError('Failed to load workday.');
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
			return;
		}
		let active = true;
		setValidating(true);

		validateWorkDay(workDay)
			.then((valid) => {
				if (!active) return;
				setIsValid(valid);
			})
			.catch((err) => {
				console.error(err);
				if (active) setIsValid(false);
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
			setError('Failed to save workday.');
			return null;
		} finally {
			setSaving(false);
		}
	}, [upsert, workDay]);

	const deleteWorkDay = useCallback(
		async (workDayId: string) => {
			const numericId = Number(workDayId);
			if (!Number.isFinite(numericId)) {
				setError('Invalid workday id.');
				return false;
			}

			setDeleting(true);
			setError(null);
			try {
				await remove(numericId);
				return true;
			} catch (err) {
				console.error(err);
				setError('Failed to delete workday.');
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
		error,
		setError,
		saveWorkDay,
		deleteWorkDay,
	};
};

type DayEditViewProps = {
	id?: string;
};

function DayEditView({ id }: DayEditViewProps) {
	const { id: routeId } = useParams();
	const effectiveId = id ?? routeId;
	const isNew = !effectiveId;
	const navigate = useNavigate();
	const {
		workDay,
		setWorkDay,
		loading,
		saving,
		deleting,
		validating,
		isValid,
		error,
		setError,
		saveWorkDay,
		deleteWorkDay,
	} = useWorkDayEditor(effectiveId);

	const typeOptions = useMemo(() => buildTypeOptions(workDay), [workDay]);

	const updateRange = useCallback(
		(
			index: number,
			updater: (range: JsTimeRange, day: JsWorkDay) => JsTimeRange
		) => {
			setWorkDay((prev) => updateWorkDayRange(prev, index, updater));
		},
		[setWorkDay]
	);

	const handleTimeChange =
		(index: number, field: 'start' | 'end') =>
		(event: ChangeEvent<HTMLInputElement>) => {
			const timeValue = event.target.value;
			updateRange(index, (range, day) => {
				const isoValue = toIsoString(day.date, timeValue);
				return field === 'start'
					? range.copy(isoValue, undefined, undefined)
					: range.copy(undefined, isoValue, undefined);
			});
		};

	const handleTypeChange =
		(index: number) => (event: ChangeEvent<HTMLInputElement>) => {
			const nextType = event.target.value;
			updateRange(index, (range) => range.copy(undefined, undefined, nextType));
		};

	const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
		const nextDate = event.target.value;
		setWorkDay((prev) => {
			if (!prev) return prev;
			const nextRanges = prev.timeRanges.map((range) => {
				const startTime = toTimeValue(range.start);
				const endTime = toTimeValue(range.end);
				const startIso = startTime ? toIsoString(nextDate, startTime) : '';
				const endIso = endTime ? toIsoString(nextDate, endTime) : '';
				return range.copy(startIso, endIso, undefined);
			});
			return prev.copy(undefined, nextDate, nextRanges);
		});
	};

	const handleAddRange = () => {
		setWorkDay((prev) => {
			if (!prev) return prev;
			const nextRanges = [
				...prev.timeRanges,
				new JsTimeRangeCtor('', '', 'WORK'),
			];
			return prev.copy(undefined, undefined, nextRanges);
		});
	};

	const handleRemoveRange = (index: number) => {
		setWorkDay((prev) => {
			if (!prev) return prev;
			const nextRanges = prev.timeRanges.filter((_, i) => i !== index);
			return prev.copy(undefined, undefined, nextRanges);
		});
	};

	const handleSave = async () => {
		if (!workDay) return;
		if (!isValid) {
			setError('Please fix validation errors before saving.');
			return;
		}

		const saved = await saveWorkDay();
		if (!saved) return;
		const savedId = saved.id ?? workDay.id;
		if (isNew) {
			navigate(savedId ? `/day/${savedId}` : '/week');
			return;
		}
		if (savedId) {
			navigate(`/day/${savedId}`);
		}
	};

	const handleCancel = () => {
		if (isNew) {
			navigate(-1);
			return;
		}
		if (workDay?.id) {
			navigate(`/day/${workDay.id}`);
			return;
		}
		navigate('/week');
	};

	const handleDelete = async () => {
		if (!workDay?.id) return;
		const deleted = await deleteWorkDay(workDay.id);
		if (deleted) {
			navigate('/week');
		}
	};

	if (loading) {
		return (
			<Box p={2}>
				<CircularProgress />
			</Box>
		);
	}

	if (!workDay) {
		return (
			<Box p={2}>
				<Typography color='error'>{error ?? 'No data'}</Typography>
			</Box>
		);
	}

	return (
		<Box p={2}>
			<Stack spacing={2}>
				<Typography variant='h5'>
					{isNew ? 'Arbeitstag erfassen' : 'Edit workday'}
				</Typography>
				{isNew ? (
					<TextField
						label='Datum'
						type='date'
						value={workDay.date}
						onChange={handleDateChange}
					/>
				) : (
					<Typography variant='subtitle1'>
						{formatDate(workDay.date)}
					</Typography>
				)}

				{error ? <Alert severity='error'>{error}</Alert> : null}

				{validating ? (
					<Alert severity='info'>
						{isNew ? 'Validating changes...' : 'AoberprA¬fe Arbeitstag...'}
					</Alert>
				) : isValid === true ? (
					<Alert severity='success'>
						{isNew ? 'Validation passed.' : 'Keine Probleme gefunden.'}
					</Alert>
				) : isValid === false ? (
					<Alert severity='error'>
						{isNew ? 'Validation failed.' : 'Validierung fehlgeschlagen.'}
					</Alert>
				) : null}

				<Stack spacing={2}>
					{workDay.timeRanges.map((range, index) => (
						<Stack
							key={index}
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							alignItems={{ xs: 'stretch', sm: 'center' }}
						>
							<TimeRangeTypeSelect
								label={isNew ? 'Typ' : 'Art'}
								value={range.type}
								options={typeOptions}
								onChange={handleTypeChange(index)}
							/>
							<TimeRangeFields
								startValue={toTimeValue(range.start)}
								endValue={toTimeValue(range.end)}
								onStartChange={handleTimeChange(index, 'start')}
								onEndChange={handleTimeChange(index, 'end')}
							/>
							<Button
								variant='text'
								color='error'
								onClick={() => handleRemoveRange(index)}
							>
								Delete
							</Button>
						</Stack>
					))}
				</Stack>

				<AddTimeRange onAdd={handleAddRange} />

				<Stack direction='row' spacing={2}>
					<Button
						variant={isNew ? 'text' : 'outlined'}
						onClick={handleCancel}
						disabled={isNew ? saving : deleting}
					>
						Cancel
					</Button>
					{isNew ? null : (
						<Button
							variant='outlined'
							color='error'
							onClick={handleDelete}
							disabled={saving || deleting}
						>
							{deleting ? 'Deleting...' : 'Delete'}
						</Button>
					)}
					<Button
						variant='contained'
						onClick={handleSave}
						disabled={saving || deleting || validating || !isValid}
					>
						{saving ? 'Saving...' : 'Save'}
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}

export default DayEditView;
