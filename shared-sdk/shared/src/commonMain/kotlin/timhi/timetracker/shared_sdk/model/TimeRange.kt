package timhi.timetracker.shared_sdk.model

import kotlinx.datetime.Instant

enum class TimeRangeType {
    WORK,
    BREAK
}

data class TimeRange(
    val start: Instant,
    val end: Instant,
    val type: TimeRangeType,
)
