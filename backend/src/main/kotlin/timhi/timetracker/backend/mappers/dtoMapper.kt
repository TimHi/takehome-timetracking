package timhi.timetracker.backend.mappers

import timhi.timetracker.backend.dto.TimeRangeDto
import timhi.timetracker.backend.dto.WorkDayDto
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay

fun WorkDay.toDto(): WorkDayDto = WorkDayDto(
    date = this.date.toString(),
    workTimes = this.workTimes.map { it.toDto() },
    breakTimes = this.breakTimes.map { it.toDto() }
)

fun TimeRange.toDto(): TimeRangeDto = TimeRangeDto(
    start = this.start.toString(),
    end = this.end.toString()
)