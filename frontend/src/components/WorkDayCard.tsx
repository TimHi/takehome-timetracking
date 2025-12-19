import { useEffect } from 'react';
import { useWorkDayDetail } from '../hooks/useWorkDayDetail';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import { formatDate, formatTime } from '../util/timeFormat';

interface WorkDayCardProps {
	workDayId: string;
}

function WorkDayCard({ workDayId }: WorkDayCardProps) {
	const { workDay, loading, fetchWeekDay } = useWorkDayDetail();

	useEffect(() => {
		fetchWeekDay(workDayId);
	}, [workDayId, fetchWeekDay]);

	if (loading) return <div>Loading...</div>;
	if (!workDay) return <div>No data</div>;

	return (
		<Card sx={{ maxWidth: 500, margin: '20px auto', boxShadow: 3 }}>
			<CardContent>
				<Typography variant='h6' gutterBottom>
					{formatDate(workDay.date)}
				</Typography>
				<Stack spacing={1}>
					{workDay.timeRanges.map((range: any, index: number) => {
						const isBreak = range.type.toLowerCase() === 'break';
						const bgColor = isBreak ? 'lightcoral' : 'lightgreen';
						const Icon = isBreak ? FreeBreakfastIcon : AccessTimeIcon;

						return (
							<Box
								key={index}
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									backgroundColor: bgColor,
									padding: '8px 12px',
									borderRadius: 2,
									gap: 2,
								}}
							>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Icon />
									<Typography>
										{formatTime(range.start)} - {formatTime(range.end)}
									</Typography>
								</Box>
								<Typography variant='body2' color='text.secondary'>
									{range.type}
								</Typography>
							</Box>
						);
					})}
				</Stack>
			</CardContent>
		</Card>
	);
}

export default WorkDayCard;
