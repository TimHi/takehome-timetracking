package timhi.timetracker.shared_sdk.model
import kotlinx.datetime.LocalDate

data class WorkDay(
    val date: LocalDate,
    val timeRanges: List<TimeRange>,
)