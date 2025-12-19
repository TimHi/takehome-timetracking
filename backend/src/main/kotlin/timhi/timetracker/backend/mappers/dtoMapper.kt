package timhi.timetracker.backend.mappers

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import timhi.timetracker.backend.dto.TimeRangeDto
import timhi.timetracker.backend.dto.WorkDayDto
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.TimeRangeType
import timhi.timetracker.shared_sdk.model.WorkDay

/* =========================
 * DTO → Domain
 * ========================= */

fun WorkDayDto.toWorkDay(): WorkDay = WorkDay(
    date = LocalDate.parse(this.date), // parses "yyyy-MM-dd"
    timeRanges = this.timeRanges.map { it.toTimeRange() }
)

fun TimeRangeDto.toTimeRange(): TimeRange = TimeRange(
    start = Instant.parse(this.start),
    end = Instant.parse(this.end),
    type = TimeRangeType.valueOf(this.type.uppercase()) // converts string to enum
)

/* =========================
 * Domain → DTO
 * ========================= */

fun WorkDay.toDto(): WorkDayDto = WorkDayDto(
    date = this.date.toString(),
    timeRanges = this.timeRanges.map { it.toDto() }
)

fun TimeRange.toDto(): TimeRangeDto = TimeRangeDto(
    start = this.start.toString(),
    end = this.end.toString(),
    type = this.type.name // returns "WORK" or "BREAK"
)
