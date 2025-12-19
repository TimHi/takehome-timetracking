package timhi.timetracker.shared_sdk

import kotlin.test.*
import kotlinx.datetime.*
import timhi.timetracker.shared_sdk.model.*
import timhi.timetracker.shared_sdk.validation.WorkDayValidationException

class WorkDayValidatorTest {

    // -------------------
    // HELPERS
    // -------------------

    // Create an Instant at UTC today with given hour/min
    private fun instant(hour: Int, min: Int = 0): Instant {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val dt = LocalDateTime(now.year, now.month, now.dayOfMonth, hour, min)
        return dt.toInstant(TimeZone.UTC)
    }

    private fun workTime(startHour: Int, startMin: Int = 0, endHour: Int, endMin: Int = 0) =
        TimeRange(
            start = instant(startHour, startMin),
            end = instant(endHour, endMin),
            type = TimeRangeType.WORK
        )

    private fun breakTime(startHour: Int, startMin: Int = 0, endHour: Int, endMin: Int = 0) =
        TimeRange(
            start = instant(startHour, startMin),
            end = instant(endHour, endMin),
            type = TimeRangeType.BREAK
        )

    private fun workDay(vararg ranges: TimeRange) =
        WorkDay(
            date = LocalDate(2025, 12, 16),
            timeRanges = ranges.toList()
        )

    private fun workRanges(day: WorkDay) = day.timeRanges.filter { it.type == TimeRangeType.WORK }
    private fun breakRanges(day: WorkDay) = day.timeRanges.filter { it.type == TimeRangeType.BREAK }

    // -------------------
    // VALID CASES
    // -------------------

    @Test
    fun `valid workday passes validation`() {
        val wd = workDay(
            workTime(8, 0, 12, 0),
            breakTime(12, 0, 12, 30),
            workTime(13, 0, 17, 0)
        )

        validateWorkDay(wd)
    }

    @Test
    fun `sufficient break passes validation`() {
        val wd = workDay(
            workTime(8, 0, 15, 0),
            breakTime(15, 0, 15, 30)
        )

        validateWorkDay(wd)
    }

    // -------------------
    // INVALID CASES
    // -------------------

    @Test
    fun `empty work times throws exception`() {
        val wd = workDay(
            breakTime(12, 0, 12, 30) // at least one break
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("EMPTY_WORK_TIME", ex.error.name)
    }

    @Test
    fun `end before start throws exception`() {
        val wd = workDay(
            workTime(10, 0, 9, 0),
            breakTime(12, 0, 12, 30)
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("END_BEFORE_START", ex.error.name)
    }

    @Test
    fun `overlapping time ranges throws exception`() {
        val wd = workDay(
            workTime(8, 0, 12, 0),
            workTime(11, 0, 15, 0),
            breakTime(12, 0, 12, 30)
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("TIME_RANGES_OVERLAP", ex.error.name)
    }

    @Test
    fun `exceed max work duration throws exception`() {
        val wd = workDay(
            workTime(8, 0, 19, 0),          // 11 hours work
            breakTime(19, 0, 19, 30)        // break after work ends, no overlap
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("MAX_WORK_TIME_EXCEEDED", ex.error.name)
    }


    @Test
    fun `break too short throws exception`() {
        val wd = workDay(
            workTime(8, 0, 15, 0),
            breakTime(15, 0, 15, 10) // 10 min break
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("BREAK_TOO_SHORT", ex.error.name)
    }

    @Test
    fun `insufficient total break throws exception`() {
        val wd = workDay(
            workTime(8, 0, 12, 0), //8:00 - 12:00 Work -> 4h
            workTime(12, 30, 18, 1), //12:30 - 17:01 Work 4:30 -> 9h1min
            breakTime(12, 0, 12, 30) // only 30 min break
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("INSUFFICIENT_BREAK_TIME", ex.error.name)
    }

    @Test
    fun `break overlaps work throws exception`() {
        val wd = workDay(
            workTime(8, 0, 12, 0),
            breakTime(11, 30, 12, 30) // overlaps last 30 min of work
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("TIME_RANGES_OVERLAP", ex.error.name)
    }
}
