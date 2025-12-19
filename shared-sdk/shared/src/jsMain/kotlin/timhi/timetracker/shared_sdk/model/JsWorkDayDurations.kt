package timhi.timetracker.shared_sdk.model

@OptIn(ExperimentalJsExport::class)
@JsExport
data class JsWorkDayDurations(val workDuration: String, val breakDuration: String)