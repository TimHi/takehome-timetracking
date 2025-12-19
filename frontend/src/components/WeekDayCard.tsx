import {
	Card,
	CardActionArea,
	CardContent,
	Typography,
	Stack,
	Divider,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useWorkDayDetail } from '../hooks/useWorkDayDetail';
import { formatDate } from '../util/timeFormat';
import { useWorkDayDurations } from '../hooks/useWorkDayDurations';
import { useWorkDays } from '../hooks/useWorkDays';

interface WeekDayCardProps {
	workDayId: string;
}

function WeekDayCard({ workDayId }: WeekDayCardProps) {
	const { workDay, fetchWeekDay } = useWorkDayDetail();
	const { getWorkDayDuration } = useWorkDays();
	const { data: durations, load: loadDurations } = useWorkDayDurations(
		workDayId,
		getWorkDayDuration
	);

	if (!workDay) {
		fetchWeekDay(workDayId);
	}

	if (!durations) {
		loadDurations();
	}

	if (!workDay) return <div>No data</div>;

	return (
		<Card>
			<CardActionArea component={Link} to={`/day/${workDayId}`}>
				<CardContent>
					<Stack spacing={1}>
						<Typography variant='h6'>{formatDate(workDay.date)}</Typography>
						<Divider />
						<Stack spacing={0.5} flex={1} alignItems='flex-start'>
							{durations && (
								<>
									<Typography variant='body2'>
										Arbeitszeit: <strong>{durations.workDuration}</strong>h
									</Typography>
									<Typography variant='body2'>
										Pause: <strong>{durations.breakDuration}</strong>h
									</Typography>
								</>
							)}
						</Stack>
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

export default WeekDayCard;
