package timhi.timetracker.backend.dto

data class TimeRangeDto(
    val start: String,  // ISO-8601 string
    val end: String // ISO-8601 string
)