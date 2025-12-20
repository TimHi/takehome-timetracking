package timhi.timetracker.backend.service

import kotlinx.datetime.Clock
import kotlinx.datetime.DateTimeUnit
import kotlinx.datetime.DayOfWeek
import kotlinx.datetime.LocalDate
import kotlinx.datetime.TimeZone
import kotlinx.datetime.minus
import kotlinx.datetime.plus
import kotlinx.datetime.toJavaLocalDate
import kotlinx.datetime.todayIn
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import timhi.timetracker.backend.persistance.toDomain
import timhi.timetracker.backend.persistance.toEntity
import timhi.timetracker.backend.repository.WorkDayRepository
import timhi.timetracker.shared_sdk.model.WorkDay

@Service
class WorkDayService(
    private val repository: WorkDayRepository
) {

    @Transactional(readOnly = true)
    fun getWorkDay(date: LocalDate): WorkDay? =
        repository.findByDate(date.toJavaLocalDate())?.toDomain()

    @Transactional(readOnly = true)
    fun getWorkDayById(id: Long): WorkDay? =
        repository.findById(id).orElse(null)?.toDomain()

    @Transactional(readOnly = true)
    fun listAll(): List<WorkDay> =
        repository.findAll().map { it.toDomain() }.sortedBy { it.date }

    @Transactional(readOnly = true)
    fun getWorkDaysForWeek(weekOffset: Long): List<WorkDay> {
        val (start, end) = weekBounds(weekOffset)
        return repository.findWeekOrdered(
            start.toJavaLocalDate(),
            end.toJavaLocalDate()
        ).map { it.toDomain() }
    }

    @Transactional
    fun upsert(workDay: WorkDay): WorkDay {
        val entity = workDay.toEntity()
        return repository.save(entity).toDomain()
    }

    @Transactional
    fun saveAll(workDays: List<WorkDay>) {
        val entities = workDays.map { it.toEntity() }
        repository.saveAll(entities)
    }

    @Transactional
    fun deleteById(id: Long) {
        repository.deleteById(id)
    }

    private fun weekBounds(weekOffset: Long): Pair<LocalDate, LocalDate> {
        val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
        val base = today.plus(weekOffset, DateTimeUnit.WEEK)

        val start = base.minus(
            (base.dayOfWeek.ordinal - DayOfWeek.MONDAY.ordinal).toLong(),
            DateTimeUnit.DAY
        )
        val end = start.plus(7, DateTimeUnit.DAY)

        return start to end
    }
}
