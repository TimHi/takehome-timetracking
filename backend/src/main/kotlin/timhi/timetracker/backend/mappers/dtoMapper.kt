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
    id = this.id,
    date = LocalDate.parse(this.date),
    timeRanges = timeRanges.map { it.toTimeRange() }
)

fun TimeRangeDto.toTimeRange(): TimeRange = TimeRange(
    start = Instant.parse(this.start),
    end = Instant.parse(this.end),
    type = TimeRangeType.valueOf(this.type.uppercase())
)

/* =========================
 * Domain → DTO
 * ========================= */

fun WorkDay.toDto(): WorkDayDto = WorkDayDto(
    id = this.id,
    date = this.date.toString(),
    timeRanges = timeRanges.map { it.toDto() }
)

fun TimeRange.toDto(): TimeRangeDto = TimeRangeDto(
    start = this.start.toString(),
    end = this.end.toString(),
    type = this.type.name
)
