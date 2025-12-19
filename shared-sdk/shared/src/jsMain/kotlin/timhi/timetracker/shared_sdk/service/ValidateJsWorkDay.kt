package timhi.timetracker.shared_sdk.service


import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import timhi.timetracker.shared_sdk.model.JsWorkDay
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.TimeRangeType
import timhi.timetracker.shared_sdk.model.WorkDay
import timhi.timetracker.shared_sdk.validateWorkDay

@OptIn(ExperimentalJsExport::class)
@JsExport
fun validate(jsWorkDay: JsWorkDay) {
    // Map JS time ranges to domain TimeRange with enum type
    val timeRanges = jsWorkDay.timeRanges.map { jsRange ->
        TimeRange(
            start = Instant.parse(jsRange.start),
            end = Instant.parse(jsRange.end),
            type = TimeRangeType.valueOf(jsRange.type.uppercase())
        )
    }

    val workDay = WorkDay(
        date = LocalDate.parse(jsWorkDay.date),
        timeRanges = timeRanges
    )

    validateWorkDay(workDay)
}
