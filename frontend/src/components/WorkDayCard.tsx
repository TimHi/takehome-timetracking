import { useEffect } from 'react';
import { useWorkDayDetail } from '../hooks/useWorkDayDetail';
import { Card, CardContent, Typography, Stack, Tooltip } from '@mui/material';

import { formatDate } from '../util/timeFormat';
import type { JsTimeRange } from 'shared';
import TimeRange from './TimeRange';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
interface WorkDayCardProps {
	workDayId: string;
}

function WorkDayCard({ workDayId }: WorkDayCardProps) {
	const { workDay, fetchWeekDay } = useWorkDayDetail();

	useEffect(() => {
		fetchWeekDay(workDayId);
	}, [workDayId, fetchWeekDay]);

	if (!workDay) return <></>;

	return (
		<Card>
			<CardContent>
				<Typography variant='h6' gutterBottom>
					{formatDate(workDay.date)}
				</Typography>
				<Stack spacing={1}>
					{workDay.timeRanges.map((range: JsTimeRange, index: number) => (
						<TimeRange key={index} index={index} range={range} />
					))}
				</Stack>
				<Stack mt={2} flex={1} flexDirection={'row'}>
					<Tooltip title='Arbeitstag bearbeiten'>
						<EditIcon />
					</Tooltip>
					<Tooltip title='Arbeitstag löschen'>
						<DeleteIcon />
					</Tooltip>
				</Stack>
			</CardContent>
		</Card>
	);
}

export default WorkDayCard;
