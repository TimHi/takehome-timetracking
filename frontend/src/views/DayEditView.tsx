import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from 'react';
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import type { JsTimeRange, JsWorkDay } from 'shared';
import { useWorkDays } from '../hooks/useWorkDays';
import { formatDate } from '../util/timeFormat';

const DEFAULT_TYPES = ['WORK', 'BREAK'];

const toTimeValue = (isoString: string) => {
	const date = new Date(isoString);
	if (Number.isNaN(date.getTime())) return '';
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
};

const toIsoString = (date: string, time: string) => {
	if (!date || !time) return '';
	const localDateTime = new Date(`${date}T${time}:00`);
	if (Number.isNaN(localDateTime.getTime())) return '';
	return localDateTime.toISOString();
};

const useWorkDayEditor = (id?: string) => {
	const { getById, upsert, validateWorkDay } = useWorkDays();
	const [workDay, setWorkDay] = useState<JsWorkDay | null>(null);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [validating, setValidating] = useState(false);
	const [isValid, setIsValid] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			if (!id) {
				setWorkDay(null);
				setIsValid(null);
				setError('No day id provided.');
				return;
			}

			setLoading(true);
			setError(null);
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

	return {
		workDay,
		setWorkDay,
		loading,
		saving,
		validating,
		isValid,
		error,
		setError,
		saveWorkDay,
	};
};

function DayEditView() {
	const { id } = useParams();
	const navigate = useNavigate();
	const {
		workDay,
		setWorkDay,
		loading,
		saving,
		validating,
		isValid,
		error,
		setError,
		saveWorkDay,
	} = useWorkDayEditor(id);

	const typeOptions = useMemo(() => {
		if (!workDay) return DEFAULT_TYPES;
		const seen = new Set(DEFAULT_TYPES);
		workDay.timeRanges.forEach((range) => seen.add(range.type));
		return Array.from(seen);
	}, [workDay]);

	const updateRange = useCallback((
		index: number,
		updater: (range: JsTimeRange, day: JsWorkDay) => JsTimeRange
	) => {
		setWorkDay((prev) => {
			if (!prev) return prev;
			const nextRanges = prev.timeRanges.map((range, i) =>
				i === index ? updater(range, prev) : range
			);
			return prev.copy(undefined, undefined, nextRanges);
		});
	}, [setWorkDay]);

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
			updateRange(index, (range) =>
				range.copy(undefined, undefined, nextType)
			);
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
		navigate(`/day/${savedId}`);
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
				<Typography variant='h5'>Edit workday</Typography>
				<Typography variant='subtitle1'>{formatDate(workDay.date)}</Typography>

				{error ? <Alert severity='error'>{error}</Alert> : null}

				{validating ? (
					<Alert severity='info'>Validating changes...</Alert>
				) : isValid === true ? (
					<Alert severity='success'>Validation passed.</Alert>
				) : isValid === false ? (
					<Alert severity='error'>Validation failed.</Alert>
				) : null}

				<Stack spacing={2}>
					{workDay.timeRanges.map((range, index) => (
						<Stack
							key={index}
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							alignItems={{ xs: 'stretch', sm: 'center' }}
						>
							<TextField
								select
								label='Type'
								value={range.type}
								onChange={handleTypeChange(index)}
								sx={{ minWidth: 140 }}
							>
								{typeOptions.map((type) => (
									<MenuItem key={type} value={type}>
										{type}
									</MenuItem>
								))}
							</TextField>
							<TextField
								label='Start'
								type='time'
								value={toTimeValue(range.start)}
								onChange={handleTimeChange(index, 'start')}
								InputLabelProps={{ shrink: true }}
								inputProps={{ step: 60 }}
							/>
							<TextField
								label='End'
								type='time'
								value={toTimeValue(range.end)}
								onChange={handleTimeChange(index, 'end')}
								InputLabelProps={{ shrink: true }}
								inputProps={{ step: 60 }}
							/>
						</Stack>
					))}
				</Stack>

				<Stack direction='row' spacing={2}>
					<Button
						variant='outlined'
						onClick={() => navigate(`/day/${workDay.id}`)}
					>
						Cancel
					</Button>
					<Button
						variant='contained'
						onClick={handleSave}
						disabled={saving || validating || !isValid}
					>
						{saving ? 'Saving...' : 'Save'}
					</Button>
				</Stack>
			</Stack>
		</Box>
	);
}

export default DayEditView;
