import { Stack } from '@mui/material';
import type { JsTimeRange } from 'shared';
import TimeRange from './TimeRange';

type TimeRangeListProps = {
	timeRanges: JsTimeRange[];
	spacing?: number;
};

function TimeRangeList({ timeRanges, spacing = 1 }: TimeRangeListProps) {
	return (
		<Stack spacing={spacing}>
			{timeRanges.map((range, index) => (
				<TimeRange key={index} index={index} range={range} />
			))}
		</Stack>
	);
}

export default TimeRangeList;
