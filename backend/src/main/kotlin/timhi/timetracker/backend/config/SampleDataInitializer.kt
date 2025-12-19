package timhi.timetracker.backend.config

import kotlinx.datetime.*
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import timhi.timetracker.backend.service.WorkDayService
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.TimeRangeType
import timhi.timetracker.shared_sdk.model.WorkDay

@Configuration
class SampleDataInitializer {

    @Bean
    fun initWorkDays(service: WorkDayService) = CommandLineRunner {

        val today = Clock.System.todayIn(TimeZone.currentSystemDefault())

        // Helper to create Instant from LocalDate + hour/minute
        fun LocalDate.at(hour: Int, minute: Int = 0): Instant =
            LocalDateTime(year, monthNumber, dayOfMonth, hour, minute)
                .toInstant(TimeZone.currentSystemDefault())

        val sampleWorkDays = mutableListOf<WorkDay>()

        // Previous week (-1)
        val prevWeek = today.minus(7, DateTimeUnit.DAY)
        repeat(3) { i ->
            val date = prevWeek.plus(i.toLong(), DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(9), date.at(11), TimeRangeType.WORK),
                    TimeRange(date.at(11), date.at(11, 15), TimeRangeType.BREAK),
                    TimeRange(date.at(11, 15), date.at(13), TimeRangeType.WORK)
                )
            )
        }

        // Current week (0)
        repeat(3) { i ->
            val date = today.plus(i.toLong(), DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(8), date.at(10), TimeRangeType.WORK),
                    TimeRange(date.at(10), date.at(10, 15), TimeRangeType.BREAK),
                    TimeRange(date.at(10, 15), date.at(12), TimeRangeType.WORK)
                )
            )
        }

        // Next week (+1)
        val nextWeek = today.plus(7, DateTimeUnit.DAY)
        repeat(3) { i ->
            val date = nextWeek.plus(i.toLong(), DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(9), date.at(12), TimeRangeType.WORK),
                    TimeRange(date.at(12), date.at(12, 30), TimeRangeType.BREAK),
                    TimeRange(date.at(12, 30), date.at(13), TimeRangeType.WORK)
                )
            )
        }

        service.saveAll(sampleWorkDays)
    }
}
