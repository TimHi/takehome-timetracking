package timhi.timetracker.backend.persistance

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import timhi.timetracker.shared_sdk.model.TimeRangeType
import java.time.Instant

@Embeddable
data class TimeRangeEmbeddable(
    @Column(name = "start_time", nullable = false)
    val start: Instant,

    @Column(name = "end_time", nullable = false)
    val end: Instant,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    val type: TimeRangeType
)