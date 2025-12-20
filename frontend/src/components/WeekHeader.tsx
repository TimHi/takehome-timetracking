import { Box, Button, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
type WeekHeaderProps = {
	weekLabel: string;
	onPrevWeek: () => void;
	onNextWeek: () => void;
	onToday: () => void;
};

function WeekHeader({
	weekLabel,
	onPrevWeek,
	onNextWeek,
	onToday,
}: WeekHeaderProps) {
	return (
		<Box
			display='flex'
			alignItems='center'
			justifyContent='space-between'
			mb={2}
			gap={2}
			sx={{
				padding: 2,
				borderRadius: 18,
				backgroundColor: 'rgba(255, 255, 255, 0.8)',
				border: '1px solid rgba(15, 23, 42, 0.08)',
				boxShadow: '0 16px 34px rgba(15, 23, 42, 0.08)',
				backdropFilter: 'blur(12px)',
			}}
		>
			<Button
				variant='outlined'
				onClick={onToday}
				startIcon={<CalendarMonthIcon />}
			>
				<Typography>Aktuelle Woche</Typography>
			</Button>
			<IconButton onClick={onPrevWeek}>
				<ArrowBackIcon />
			</IconButton>

			<Typography variant='h6'>{weekLabel || 'Lädt...'}</Typography>

			<IconButton onClick={onNextWeek}>
				<ArrowForwardIcon />
			</IconButton>
		</Box>
	);
}

export default WeekHeader;
