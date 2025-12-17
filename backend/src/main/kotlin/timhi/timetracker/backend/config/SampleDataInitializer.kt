package timhi.timetracker.backend.config


import kotlinx.datetime.*
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import timhi.timetracker.backend.service.WorkDayService
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay

@Configuration
class SampleDataInitializer {

    @Bean
    fun initWorkDays(service: WorkDayService) = CommandLineRunner {

        val today = Clock.System.todayIn(TimeZone.currentSystemDefault())

        // Helper to create Instant from LocalDate + hour
        fun LocalDate.at(hour: Int, minute: Int = 0): Instant {
            val ldt = LocalDateTime(year, monthNumber, dayOfMonth, hour, minute)
            return ldt.toInstant(TimeZone.currentSystemDefault())
        }

        val sampleWorkDays = mutableListOf<WorkDay>()

        // Previous week (-1)
        val prevWeek = today.minus(7, DateTimeUnit.DAY)
        repeat(3) { i ->
            val date = prevWeek.plus(i.toLong(), DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                workTimes = listOf(TimeRange(start = date.at(9), end = date.at(13))),
                breakTimes = listOf(TimeRange(start = date.at(11), end = date.at(11, 15)))
            )
        }

        // Current week (0)
        repeat(3) { i ->
            val date = today.plus(i.toLong(), DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                workTimes = listOf(TimeRange(start = date.at(8), end = date.at(12))),
                breakTimes = listOf(TimeRange(start = date.at(10), end = date.at(10, 15)))
            )
        }

        // Next week (+1)
        val nextWeek = today.plus(7, DateTimeUnit.DAY)
        repeat(3) { i ->
            val date = nextWeek.plus(i.toLong(), DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                workTimes = listOf(TimeRange(start = date.at(9), end = date.at(13))),
                breakTimes = emptyList()
            )
        }

        service.saveAll(sampleWorkDays)
    }
}
