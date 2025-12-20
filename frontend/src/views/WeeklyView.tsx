import { Box, Typography } from '@mui/material';
import WeekHeader from '../components/WeekHeader';
import { useWeeklyWorkDays } from '../hooks/useWeeklyWorkDays';
import WeekDayCard from '../components/WeekDayCard';

function WeeklyView() {
	const { workDays, weekLabel, loading, prevWeek, nextWeek, jumpToToday } =
		useWeeklyWorkDays();

	return (
		<Box p={2}>
			<WeekHeader
				weekLabel={weekLabel}
				onPrevWeek={prevWeek}
				onNextWeek={nextWeek}
				onToday={jumpToToday}
			/>

			{loading ? (
				<Typography>Lädt...</Typography>
			) : workDays.length === 0 ? (
				<Typography>Keine Arbeitstage erfasst</Typography>
			) : (
				<Box display='flex' flexWrap='wrap' gap={2}>
					{workDays.map((day) => (
						<Box key={day.id}>
							<WeekDayCard workDayId={day.id} />
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
}

export default WeeklyView;
