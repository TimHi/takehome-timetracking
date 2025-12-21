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
				setError('Keine Tages-ID angegeben.');
				return;
			}

			setLoading(true);
			setError(null);
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

	return (
		<Box p={2}>
			<Stack
				direction='row'
				alignItems='center'
				justifyContent='space-between'
				mb={1}
			>
				<Typography variant='h5'>Arbeitstag</Typography>
				{id ? (
					<Tooltip title='Zeiten bearbeiten'>
						<IconButton
							aria-label='Arbeitstag bearbeiten'
							onClick={() => navigate(`/day/${id}/edit`)}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
				) : null}
			</Stack>

			{loading ? (
				<Typography>Lädt...</Typography>
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
