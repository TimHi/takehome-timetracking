package timhi.timetracker.shared_sdk.model

import kotlinx.datetime.Instant

data class TimeRange(
    val start: Instant,
    val end: Instant
)
