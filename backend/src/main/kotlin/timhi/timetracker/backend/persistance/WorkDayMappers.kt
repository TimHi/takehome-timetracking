package timhi.timetracker.backend.persistance

import kotlinx.datetime.toJavaInstant
import kotlinx.datetime.toJavaLocalDate
import kotlinx.datetime.toKotlinLocalDate
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay
import kotlinx.datetime.toKotlinInstant

fun WorkDayEntity.toDomain(): WorkDay = WorkDay(
    date = date.toKotlinLocalDate(),
timeRanges = timeRanges.map { it.toDomain() }
)

fun WorkDay.toEntity(): WorkDayEntity = WorkDayEntity(
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
