import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useWorkDays } from '../hooks/useWorkDays';
import type { JsWorkDay } from 'shared';

export const WeeklyView: React.FC = () => {
	const server = useWorkDays();
	const [weekOffset, setWeekOffset] = useState(0);
	const [workDays, setWorkDays] = useState<JsWorkDay[]>([]);
	const [loading, setLoading] = useState(true);

	// Fetch week whenever offset changes
	useEffect(() => {
		server
			.fetchWeek(weekOffset)
			.then((data) => setWorkDays(data))
			.finally(() => setLoading(false));
	}, [server, weekOffset]);

	const handlePrevWeek = () => setWeekOffset((prev) => prev - 1);
	const handleNextWeek = () => setWeekOffset((prev) => prev + 1);

	return (
		<Box p={2}>
			{/* Header with navigation */}
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				mb={2}
			>
				<Button variant='contained' onClick={handlePrevWeek}>
					Previous Week
				</Button>
				<Typography variant='h6'>
					{weekOffset === 0 ? 'Current Week' : `Week Offset: ${weekOffset}`}
				</Typography>
				<Button variant='contained' onClick={handleNextWeek}>
					Next Week
				</Button>
			</Box>

			{/* Loading or empty state */}
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
									{day.date.toString?.() ?? JSON.stringify(day.date)}
								</Typography>

								{/* Work Times */}
								<Typography variant='body2' color='text.secondary' mt={1}>
									Work Times:
								</Typography>
								{(day.workTimes ?? []).map((t, i) => (
									<Typography key={`${t.start}-${t.end}-${i}`}>
										{t.start} - {t.end}
									</Typography>
								))}

								{/* Break Times */}
								<Typography variant='body2' color='text.secondary' mt={1}>
									Break Times:
								</Typography>
								{(day.breakTimes ?? []).map((b, i) => (
									<Typography key={`${b.start}-${b.end}-${i}`}>
										{b.start} - {b.end}
									</Typography>
								))}
							</CardContent>
						</Card>
					))}
				</Box>
			)}
		</Box>
	);
};
