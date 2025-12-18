package timhi.timetracker.backend.dto

data class WorkDayDto(
    val date: String, // ISO-8601 string
    val workTimes: List<TimeRangeDto>,
    val breakTimes: List<TimeRangeDto>
)