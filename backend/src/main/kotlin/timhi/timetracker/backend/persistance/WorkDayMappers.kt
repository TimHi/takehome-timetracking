package timhi.timetracker.backend.persistance

import kotlinx.datetime.toJavaInstant
import kotlinx.datetime.toJavaLocalDate
import kotlinx.datetime.toKotlinInstant
import kotlinx.datetime.toKotlinLocalDate
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay

//Persistance layer can't work with kotlinx.datetime, create wrapper to convert between domain and entities
fun WorkDayEntity.toDomain(): WorkDay = WorkDay(
    date = date.toKotlinLocalDate(),
    workTimes = workTimes.map { it.toDomain() },
    breakTimes = breakTimes.map { it.toDomain() }
)

fun TimeRangeEmbeddable.toDomain(): TimeRange = TimeRange(
    start = start.toKotlinInstant(),
    end = end.toKotlinInstant()
)


fun WorkDay.toEntity(): WorkDayEntity = WorkDayEntity(
    date = date.toJavaLocalDate(),
    workTimes = workTimes.map { it.toEmbeddable() },
    breakTimes = breakTimes.map { it.toEmbeddable() }
)

fun TimeRange.toEmbeddable(): TimeRangeEmbeddable = TimeRangeEmbeddable(
    start = start.toJavaInstant(),
    end = end.toJavaInstant()
)