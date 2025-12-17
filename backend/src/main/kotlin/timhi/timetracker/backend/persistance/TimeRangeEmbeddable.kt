package timhi.timetracker.backend.persistance

import jakarta.persistence.Column
import jakarta.persistence.Embeddable

@Embeddable
data class TimeRangeEmbeddable(
    @Column(name = "start_time", nullable = false)
    val start: java.time.Instant,

    @Column(name = "end_time", nullable = false)
    val end: java.time.Instant
)