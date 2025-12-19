import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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
			<IconButton onClick={onToday}>
				<Typography>Aktuelle Woche</Typography>
			</IconButton>
			<IconButton onClick={onPrevWeek}>
				<ArrowBackIcon />
			</IconButton>

			<Typography variant='h6'>{weekLabel || 'Loading...'}</Typography>

			<IconButton onClick={onNextWeek}>
				<ArrowForwardIcon />
			</IconButton>
		</Box>
	);
}

export default WeekHeader;
