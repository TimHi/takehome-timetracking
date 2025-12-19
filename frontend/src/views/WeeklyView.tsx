import { Box, Typography } from '@mui/material';
import WeekHeader from '../components/WeekHeader';
import { useWeeklyWorkDays } from '../hooks/useWeeklyWorkDays';

import WorkDayCard from '../components/WorkDayCard';

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
			{/* TODO_THL: refactor into single WorkDay Component, make clickable -> nav to detail view */}
			{loading ? (
				<Typography>Loading...</Typography>
			) : workDays.length === 0 ? (
				<Typography>No workdays for this week.</Typography>
			) : (
				<Box
					display='flex'
					flexWrap='wrap'
					justifyContent='space-between' // distribute evenly across the row
					gap={2} // spacing between cards
				>
					{workDays.map((day) => (
						<Box
							key={day.id}
							flex='1 1 13%' // makes 7 cards fit nicely in one row
							minWidth='200px' // ensures cards don't shrink too much on smaller screens
							maxWidth='250px'
						>
							<WorkDayCard workDayId={day.id} />
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
}

export default WeeklyView;
