import { Box, Tooltip, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import { formatTime } from '../util/timeFormat';
import type { JsTimeRange } from 'shared';

interface TimeRangeProps {
	range: JsTimeRange;
	index: number;
}

function TimeRange({ range }: TimeRangeProps) {
	const isBreak = range.type.toLowerCase() === 'break';
	const bgColor = isBreak ? 'IndianRed' : 'lightgreen';
	const Icon = isBreak ? FreeBreakfastIcon : AccessTimeIcon;
	const tooltipTitle = isBreak ? 'Pause' : 'Arbeitszeit';
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				backgroundColor: bgColor,
				padding: 2,
				borderRadius: 2,
			}}
		>
			{/* LEFT SIDE */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 2,
				}}
			>
				<Tooltip title={tooltipTitle}>
					<Icon />
				</Tooltip>
				<Typography whiteSpace='nowrap'>
					{formatTime(range.start)} – {formatTime(range.end)}
				</Typography>
			</Box>
		</Box>
	);
}

export default TimeRange;
