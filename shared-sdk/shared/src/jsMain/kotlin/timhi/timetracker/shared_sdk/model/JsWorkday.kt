package timhi.timetracker.shared_sdk.model

import kotlin.js.ExperimentalJsExport
import kotlin.js.JsExport

@OptIn(ExperimentalJsExport::class)
@JsExport
data class JsWorkDay(
    val date: String,
    val timeRanges: Array<JsTimeRange>
)
