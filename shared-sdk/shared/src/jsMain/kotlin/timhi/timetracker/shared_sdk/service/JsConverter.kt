package timhi.timetracker.shared_sdk.service


import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import timhi.timetracker.shared_sdk.model.JsTimeRange
import timhi.timetracker.shared_sdk.model.JsWorkDay
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay

fun JsTimeRange.toDomain(): TimeRange = TimeRange(start = Instant.parse(startIso), end = Instant.parse(endIso))
fun JsWorkDay.toDomain(): WorkDay = WorkDay(
    date = LocalDate.parse(dateIso),
    workTimes = workTimesArray.map { it.toDomain() },
    breakTimes = breakTimesArray.map { it.toDomain() })