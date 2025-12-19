package timhi.timetracker.shared_sdk.model

import kotlin.js.ExperimentalJsExport
import kotlin.js.JsExport

@OptIn(ExperimentalJsExport::class)
@JsExport
data class JsTimeRange(val start: String, val end: String, val type: String)

