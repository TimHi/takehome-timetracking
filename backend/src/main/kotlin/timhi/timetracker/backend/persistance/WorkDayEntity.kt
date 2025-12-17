package timhi.timetracker.backend.persistance

import jakarta.persistence.CollectionTable
import jakarta.persistence.Column
import jakarta.persistence.ElementCollection
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.Table

@Entity
@Table(name = "work_days")
data class WorkDayEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false)
    val date: java.time.LocalDate,

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "work_times",
        joinColumns = [JoinColumn(name = "work_day_id")]
    )
    val workTimes: List<TimeRangeEmbeddable> = emptyList(),

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "break_times",
        joinColumns = [JoinColumn(name = "work_day_id")]
    )
    val breakTimes: List<TimeRangeEmbeddable> = emptyList()
)

