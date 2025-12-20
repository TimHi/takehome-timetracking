import { useEffect, useState } from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';
import type { JsWorkDay } from 'shared';
import { useWorkDays } from '../hooks/useWorkDays';
import { formatDate } from '../util/timeFormat';
import TimeRangeList from '../components/TimeRangeList';

function DayView() {
	const { id } = useParams();
	const navigate = useNavigate();
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
			<Stack
				direction='row'
				alignItems='center'
				justifyContent='space-between'
				mb={1}
			>
				<Typography variant='h5'>Workday</Typography>
				{id ? (
					<Tooltip title='Edit time ranges'>
						<IconButton
							aria-label='edit workday'
							onClick={() => navigate(`/day/${id}/edit`)}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
				) : null}
			</Stack>

			{loading ? (
				<Typography>Loading...</Typography>
			) : error ? (
				<Typography color='error'>{error}</Typography>
			) : workDay ? (
				<>
					<Typography variant='h6' gutterBottom>
						{formatDate(workDay.date)}
					</Typography>
					<TimeRangeList timeRanges={workDay.timeRanges} />
				</>
			) : (
				<Typography>Keine Daten</Typography>
			)}
		</Box>
	);
}

export default DayView;
