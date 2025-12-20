package timhi.timetracker.backend.request

data class WorkDayUpsertRequest(
    val id: Long? = null,
    /** ISO-8601 date string: "yyyy-MM-dd" */
    val date: String,
    val timeRanges: List<TimeRangeRequest>,
)

data class TimeRangeRequest(
    val type: String,
    /** ISO-8601 instant string (as your frontend creates): "yyyy-MM-ddTHH:mm:ssZ" */
    val start: String,
    val end: String,
)