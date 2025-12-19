package timhi.timetracker.shared_sdk.validation

import kotlin.js.ExperimentalJsExport
import kotlin.js.JsExport

@OptIn(ExperimentalJsExport::class)
@JsExport
enum class WorkDayValidationError {
    EMPTY_TIME_RANGE,
    END_BEFORE_START,
    MAX_WORK_TIME_EXCEEDED,
    BREAK_TOO_SHORT,
    INSUFFICIENT_BREAK_TIME,
    TIME_RANGES_OVERLAP,
    EMPTY_WORK_TIME
}
