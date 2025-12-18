package timhi.timetracker.shared_sdk.service


import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import timhi.timetracker.shared_sdk.model.JsTimeRange
import timhi.timetracker.shared_sdk.model.JsWorkDay
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay

fun JsTimeRange.toDomain(): TimeRange = TimeRange(start = Instant.parse(start), end = Instant.parse(end))
fun JsWorkDay.toDomain(): WorkDay = WorkDay(
    date = LocalDate.parse(date), // parse ISO string to LocalDate
    workTimes = workTimes.map { it.toDomain() },
    breakTimes = breakTimes.map { it.toDomain() }
)