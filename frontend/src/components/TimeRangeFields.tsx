import { TextField } from '@mui/material';
import type { ChangeEvent } from 'react';

type TimeRangeFieldsProps = {
	startValue: string;
	endValue: string;
	onStartChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onEndChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function TimeRangeFields({
	startValue,
	endValue,
	onStartChange,
	onEndChange,
}: TimeRangeFieldsProps) {
	return (
		<>
			<TextField
				label='Start'
				type='time'
				value={startValue}
				slotProps={{ inputLabel: { shrink: true } }}
				onChange={onStartChange}
			/>
			<TextField
				label='Ende'
				type='time'
				value={endValue}
				slotProps={{ inputLabel: { shrink: true } }}
				onChange={onEndChange}
			/>
		</>
	);
}

export default TimeRangeFields;
