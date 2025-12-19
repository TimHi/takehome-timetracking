import { Box, Card, CardContent, Typography } from '@mui/material';
import WeekHeader from '../components/WeekHeader';
import { useWeeklyWorkDays } from '../hooks/useWeeklyWorkDays';
import type { JsTimeRange } from 'shared';
import WorkIcon from '@mui/icons-material/Work';
import RestaurantIcon from '@mui/icons-material/Restaurant';

function WeeklyView() {
	const { workDays, weekLabel, loading, prevWeek, nextWeek, jumpToToday } =
		useWeeklyWorkDays();

	//TODO_THL: Move helpers to utils.ts
	// Helper to format "YYYY-MM-DD" or ISO string to "DD.MM.YYYY"
	const formatDate = (isoDate: string) => {
		const date = new Date(isoDate);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}.${month}.${year}`;
	};

	// Helper to format ISO string to "HH:mm"
	const formatTime = (isoDate: string) => {
		const date = new Date(isoDate);
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		return `${hours}:${minutes}`;
	};

	function renderTime(range: JsTimeRange) {
		if (range.type === 'WORK') {
			return (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<WorkIcon fontSize='small' style={{ verticalAlign: 'middle' }} />
					<Typography>
						{formatTime(range.start)} - {formatTime(range.end)}
					</Typography>
				</Box>
			);
		} else if (range.type === 'BREAK') {
			return (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<RestaurantIcon
						fontSize='small'
						style={{ verticalAlign: 'middle' }}
					/>
					<Typography>
						{formatTime(range.start)} - {formatTime(range.end)}
					</Typography>
				</Box>
			);
		} else {
			return 'Unbekannter Zeitraum';
		}
	}

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
					display='grid'
					gridTemplateColumns='repeat(auto-fill, minmax(280px, 1fr))'
					gap={2}
				>
					{workDays.map((day) => (
						<Card key={day.date}>
							<CardContent>
								<Typography variant='subtitle1'>
									{formatDate(day.date)}
								</Typography>

								<Typography variant='body2' color='text.secondary' mt={1}>
									Work Times:
								</Typography>
								{(day.timeRanges ?? []).map((t, i) => (
									<Typography key={`${t.start}-${t.end}-${i}`}>
										{renderTime(t)}
									</Typography>
								))}
							</CardContent>
						</Card>
					))}
				</Box>
			)}
		</Box>
	);
}

export default WeeklyView;
