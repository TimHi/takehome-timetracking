import { MenuItem, TextField } from '@mui/material';
import type { ChangeEvent } from 'react';

type TimeRangeTypeSelectProps = {
	label: string;
	value: string;
	options: string[];
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	minWidth?: number;
	displayMap?: Record<string, string>;
};

const DEFAULT_DISPLAY_MAP: Record<string, string> = {
	WORK: 'Arbeit',
	BREAK: 'Pause',
};

function TimeRangeTypeSelect({
	label,
	value,
	options,
	onChange,
	minWidth = 140,
	displayMap = DEFAULT_DISPLAY_MAP,
}: TimeRangeTypeSelectProps) {
	return (
		<TextField
			select
			label={label}
			value={value}
			onChange={onChange}
			sx={{ minWidth }}
		>
			{options.map((option) => (
				<MenuItem key={option} value={option}>
					{displayMap[option] ?? option}
				</MenuItem>
			))}
		</TextField>
	);
}

export default TimeRangeTypeSelect;
