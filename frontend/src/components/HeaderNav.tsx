import { AppBar, Box, Button, IconButton, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ListIcon from '@mui/icons-material/List';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

function HeaderNav() {
	return (
		<AppBar position='static' color='default' elevation={1}>
			<Toolbar sx={{ gap: 1 }}>
				<IconButton
					component={Link}
					to='/week'
					aria-label='Home'
					size='large'
				>
					<HomeIcon />
				</IconButton>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Button component={Link} to='/week' startIcon={<CalendarTodayIcon />}>
						Wochen
					</Button>
					<Button component={Link} to='/days' startIcon={<ListIcon />}>
						Tage
					</Button>
				</Box>
				<Box sx={{ flexGrow: 1 }} />
				<Button
					startIcon={<AddIcon />}
					variant='contained'
					component={Link}
					to='/day/new'
				>
					Arbeitstag erfassen
				</Button>
			</Toolbar>
		</AppBar>
	);
}

export default HeaderNav;
