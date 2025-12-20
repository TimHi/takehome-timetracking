import { Box, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
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
	const Icon = isBreak ? FreeBreakfastIcon : AccessTimeIcon;
	const tooltipTitle = isBreak ? 'Pause' : 'Arbeitszeit';
	return (
		<Box
			sx={(theme) => ({
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				backgroundColor: isBreak
					? alpha(theme.palette.error.main, 0.12)
					: alpha(theme.palette.success.main, 0.12),
				border: `1px solid ${
					isBreak
						? alpha(theme.palette.error.main, 0.25)
						: alpha(theme.palette.success.main, 0.25)
				}`,
				color: theme.palette.text.primary,
				padding: '6px 10px',
				borderRadius: 12,
				backdropFilter: 'blur(8px)',
				transition: 'transform 0.2s ease, box-shadow 0.2s ease',
				boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)',
				minHeight: 44,
				'&:hover': {
					transform: 'translateY(-1px)',
					boxShadow: '0 10px 22px rgba(15, 23, 42, 0.12)',
				},
			})}
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
