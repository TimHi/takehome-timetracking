import { useEffect, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import type { JsWorkDay, JsTimeRange } from 'shared';
import { useWorkDays } from '../hooks/useWorkDays';
import { formatDate } from '../util/timeFormat';
import TimeRange from '../components/TimeRange';

function DayView() {
	const { id } = useParams();
	const { getById } = useWorkDays();
	const [workDay, setWorkDay] = useState<JsWorkDay | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		const load = async () => {
			if (!id) {
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

	return (
		<Box p={2}>
			<Typography variant='h5' gutterBottom>
				Workday
			</Typography>

			{loading ? (
				<Typography>Loading...</Typography>
			) : error ? (
				<Typography color='error'>{error}</Typography>
			) : workDay ? (
				<>
					<Typography variant='h6' gutterBottom>
						{formatDate(workDay.date)}
					</Typography>
					<Stack spacing={1}>
						{workDay.timeRanges.map((range: JsTimeRange, index: number) => (
							<TimeRange key={index} index={index} range={range} />
						))}
					</Stack>
				</>
			) : (
				<Typography>No data</Typography>
			)}
		</Box>
	);
}

export default DayView;
