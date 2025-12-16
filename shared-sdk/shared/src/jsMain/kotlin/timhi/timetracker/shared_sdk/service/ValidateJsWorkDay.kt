package timhi.timetracker.shared_sdk.service


import kotlinx.datetime.LocalDate
import timhi.timetracker.shared_sdk.model.JsWorkDay
import timhi.timetracker.shared_sdk.model.WorkDay
import timhi.timetracker.shared_sdk.validateWorkDay

@OptIn(ExperimentalJsExport::class)
@JsExport
fun validate(jsWorkDay: JsWorkDay) {
    val workDay = WorkDay(
        date = LocalDate.parse(jsWorkDay.dateIso),
        workTimes = jsWorkDay.workTimesArray.map { it.toDomain() },
        breakTimes = jsWorkDay.breakTimesArray.map { it.toDomain() }
    )
    validateWorkDay(workDay)
}
