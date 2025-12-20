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
