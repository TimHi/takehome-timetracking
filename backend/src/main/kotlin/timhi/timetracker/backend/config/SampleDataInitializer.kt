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
        run {
            val date = prevWeek
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(9, 5), date.at(12), TimeRangeType.WORK),
                    TimeRange(date.at(12), date.at(12, 45), TimeRangeType.BREAK),
                    TimeRange(date.at(12, 45), date.at(17, 10), TimeRangeType.WORK)
                )
            )
        }
        run {
            val date = prevWeek.plus(1, DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(8, 40), date.at(11, 30), TimeRangeType.WORK),
                    TimeRange(date.at(11, 30), date.at(11, 45), TimeRangeType.BREAK),
                    TimeRange(date.at(11, 45), date.at(13), TimeRangeType.WORK),
                    TimeRange(date.at(13), date.at(13, 30), TimeRangeType.BREAK),
                    TimeRange(date.at(13, 30), date.at(16, 30), TimeRangeType.WORK)
                )
            )
        }
        run {
            val date = prevWeek.plus(2, DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(10), date.at(12), TimeRangeType.WORK),
                    TimeRange(date.at(12), date.at(12, 30), TimeRangeType.BREAK),
                    TimeRange(date.at(12, 30), date.at(15), TimeRangeType.WORK)
                )
            )
        }

        // Current week (0)
        run {
            val date = today
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(8, 15), date.at(11, 45), TimeRangeType.WORK),
                    TimeRange(date.at(11, 45), date.at(12, 30), TimeRangeType.BREAK),
                    TimeRange(date.at(12, 30), date.at(17), TimeRangeType.WORK)
                )
            )
        }
        run {
            val date = today.plus(1, DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(9), date.at(11), TimeRangeType.WORK),
                    TimeRange(date.at(11), date.at(11, 15), TimeRangeType.BREAK),
                    TimeRange(date.at(11, 15), date.at(12, 15), TimeRangeType.WORK),
                    TimeRange(date.at(12, 15), date.at(13), TimeRangeType.BREAK),
                    TimeRange(date.at(13), date.at(17, 30), TimeRangeType.WORK)
                )
            )
        }
        run {
            val date = today.plus(2, DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(7, 50), date.at(10, 30), TimeRangeType.WORK),
                    TimeRange(date.at(10, 30), date.at(10, 45), TimeRangeType.BREAK),
                    TimeRange(date.at(10, 45), date.at(12, 30), TimeRangeType.WORK)
                )
            )
        }

        // Next week (+1)
        val nextWeek = today.plus(7, DateTimeUnit.DAY)
        run {
            val date = nextWeek
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(9, 30), date.at(12, 15), TimeRangeType.WORK),
                    TimeRange(date.at(12, 15), date.at(13), TimeRangeType.BREAK),
                    TimeRange(date.at(13), date.at(18), TimeRangeType.WORK)
                )
            )
        }
        run {
            val date = nextWeek.plus(1, DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(8, 30), date.at(11, 30), TimeRangeType.WORK),
                    TimeRange(date.at(11, 30), date.at(12), TimeRangeType.BREAK),
                    TimeRange(date.at(12), date.at(16), TimeRangeType.WORK)
                )
            )
        }
        run {
            val date = nextWeek.plus(2, DateTimeUnit.DAY)
            sampleWorkDays += WorkDay(
                date = date,
                timeRanges = listOf(
                    TimeRange(date.at(9), date.at(10, 30), TimeRangeType.WORK),
                    TimeRange(date.at(10, 30), date.at(10, 45), TimeRangeType.BREAK),
                    TimeRange(date.at(10, 45), date.at(12), TimeRangeType.WORK),
                    TimeRange(date.at(12), date.at(12, 45), TimeRangeType.BREAK),
                    TimeRange(date.at(12, 45), date.at(15, 30), TimeRangeType.WORK)
                )
            )
        }

        service.saveAll(sampleWorkDays)
    }
}
