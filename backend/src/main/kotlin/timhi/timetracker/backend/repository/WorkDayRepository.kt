package timhi.timetracker.backend.repository


import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import timhi.timetracker.backend.persistance.WorkDayEntity
import java.time.LocalDate

interface WorkDayRepository : JpaRepository<WorkDayEntity, Long> {

    fun findByDate(date: LocalDate): WorkDayEntity?
    fun existsByDate(date: LocalDate): Boolean
    fun findByDateBetween(
        start: LocalDate,
        end: LocalDate
    ): List<WorkDayEntity>

    @Query(
        """
        select wd from WorkDayEntity wd
        where wd.date >= :start and wd.date <= :end
        order by wd.date asc
        """
    )
    fun findWeekOrdered(
        @Param("start") start: LocalDate,
        @Param("end") end: LocalDate
    ): List<WorkDayEntity>
}
