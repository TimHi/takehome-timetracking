import { useEffect, useState } from 'react';
import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	Stack,
	Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import type { JsWorkDay } from 'shared';
import { useWorkDays } from '../hooks/useWorkDays';
import { formatDate } from '../util/timeFormat';

function WorkDayListView() {
	const { listAll, loading } = useWorkDays();
	const [workDays, setWorkDays] = useState<JsWorkDay[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		const load = async () => {
			setError(null);
			try {
				const days = await listAll();
				if (active) setWorkDays(days);
			} catch (err) {
				console.error(err);
				if (active) setError('Arbeitstage konnten nicht geladen werden.');
			}
		};

		load();
		return () => {
			active = false;
		};
	}, [listAll]);

	return (
		<Box p={2}>
			<Typography variant='h5' gutterBottom>
				Arbeitstage
			</Typography>

			{loading ? (
				<Typography>Lädt...</Typography>
			) : error ? (
				<Typography color='error'>{error}</Typography>
			) : workDays.length === 0 ? (
				<Typography>Keine Arbeitstage erfasst</Typography>
			) : (
				<Stack spacing={2}>
					{workDays.map((day) => (
						<Card key={day.id}>
							<CardActionArea component={Link} to={`/day/${day.id}`}>
								<CardContent>
									<Typography variant='h6'>{formatDate(day.date)}</Typography>
									<Typography color='text.secondary'>
										{day.timeRanges.length} Einträge
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					))}
				</Stack>
			)}
		</Box>
	);
}

export default WorkDayListView;
