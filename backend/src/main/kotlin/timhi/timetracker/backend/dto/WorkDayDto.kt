package timhi.timetracker.backend.dto

data class WorkDayDto(
    val id: Long? = null,
    val date: String, // ISO-8601 string
    val timeRanges: List<TimeRangeDto>,
)