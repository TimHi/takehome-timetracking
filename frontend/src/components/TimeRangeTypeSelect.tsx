import { MenuItem, TextField } from '@mui/material';
import type { ChangeEvent } from 'react';
import { toTimeRangeTypeLabel } from '../util/enumMessages';

type TimeRangeTypeSelectProps = {
	label: string;
	value: string;
	options: string[];
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	minWidth?: number;
	displayMap?: Record<string, string>;
};

function TimeRangeTypeSelect({
	label,
	value,
	options,
	onChange,
	minWidth = 140,
	displayMap,
}: TimeRangeTypeSelectProps) {
	return (
		<TextField
			select
			label={label}
			value={value}
			onChange={onChange}
			sx={{ minWidth }}
		>
			{options.map((option) => {
				const label = displayMap?.[option] ?? toTimeRangeTypeLabel(option);
				return (
					<MenuItem key={option} value={option}>
						{label}
					</MenuItem>
				);
			})}
		</TextField>
	);
}

export default TimeRangeTypeSelect;
