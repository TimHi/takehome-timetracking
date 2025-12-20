package timhi.timetracker.backend.persistance

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import kotlinx.datetime.toJavaInstant
import kotlinx.datetime.toJavaLocalDate
import kotlinx.datetime.toKotlinLocalDate
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay
import kotlinx.datetime.toKotlinInstant
import timhi.timetracker.backend.request.TimeRangeRequest
import timhi.timetracker.backend.request.WorkDayUpsertRequest
import timhi.timetracker.shared_sdk.model.TimeRangeType

fun WorkDayEntity.toDomain(): WorkDay = WorkDay(
    id = this.id,
    date = date.toKotlinLocalDate(),
    timeRanges = timeRanges.map { it.toDomain() }
)

fun WorkDay.toEntity(): WorkDayEntity = WorkDayEntity(
    id = id,
    date = date.toJavaLocalDate(),
    timeRanges = timeRanges.map { it.toEmbeddable() }
)

fun TimeRangeEmbeddable.toDomain(): TimeRange = TimeRange(
    start = start.toKotlinInstant(),
    end = end.toKotlinInstant(),
    type = type
)

fun TimeRange.toEmbeddable(): TimeRangeEmbeddable = TimeRangeEmbeddable(
    start = start.toJavaInstant(),    // kotlinx.datetime.Instant -> java.time.Instant
    end = end.toJavaInstant(),
    type = type
)

fun WorkDayUpsertRequest.toWorkDay(): WorkDay =
    WorkDay(
        id = id,
        date = LocalDate.parse(date), // <-- conversion happens here, not in Jackson
        timeRanges = timeRanges.map { it.toTimeRange() }
    )

fun TimeRangeRequest.toTimeRange(): TimeRange =
    TimeRange(
        type = TimeRangeType.valueOf(type),
        start = Instant.parse(start),
        end = Instant.parse(end),
    )