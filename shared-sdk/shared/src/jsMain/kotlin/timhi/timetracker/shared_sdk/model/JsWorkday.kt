package timhi.timetracker.shared_sdk.model

import kotlin.js.ExperimentalJsExport
import kotlin.js.JsExport

@OptIn(ExperimentalJsExport::class)
@JsExport
data class JsWorkDay(
    val dateIso: String,
    val workTimesArray: Array<JsTimeRange>,
    val breakTimesArray: Array<JsTimeRange>
)
