package timhi.timetracker.backend.persistance

import jakarta.persistence.*
import timhi.timetracker.shared_sdk.model.TimeRangeType
import java.time.LocalDate

@Entity
@Table(name = "work_days")
data class WorkDayEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val date: LocalDate,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "time_ranges",
        joinColumns = [JoinColumn(name = "work_day_id")]
    )
    val timeRanges: List<TimeRangeEmbeddable> = emptyList()
)
