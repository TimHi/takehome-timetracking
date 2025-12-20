import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

type AddTimeRangeProps = {
	onAdd: () => void;
	disabled?: boolean;
	label?: string;
};

function AddTimeRange({
	onAdd,
	disabled = false,
	label = 'Zeitraum hinzufuegen',
}: AddTimeRangeProps) {
	return (
		<Button
			variant='outlined'
			startIcon={<AddIcon />}
			onClick={onAdd}
			disabled={disabled}
		>
			{label}
		</Button>
	);
}

export default AddTimeRange;
