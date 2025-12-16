package timhi.timetracker.shared_sdk

import kotlin.test.*
import kotlinx.datetime.*
import timhi.timetracker.shared_sdk.model.*
import timhi.timetracker.shared_sdk.validation.WorkDayValidationException

class WorkDayValidatorTest {

    // Helper: create Instant at UTC on today with given hour and minute
    private fun instant(hour: Int, min: Int = 0): Instant {
        val now = Clock.System.now().toLocalDateTime(TimeZone.UTC)
        val dt = LocalDateTime(now.year, now.month, now.dayOfMonth, hour, min)
        return dt.toInstant(TimeZone.UTC)
    }

    // Helper: create WorkDay with given work and break times
    private fun workDay(
        workRanges: List<TimeRange>,
        breakRanges: List<TimeRange>
    ): WorkDay {
        return WorkDay(
            date = LocalDate(2025, 12, 16),
            workTimes = workRanges,
            breakTimes = breakRanges
        )
    }

    // -------------------
    // VALID CASES
    // -------------------

    @Test
    fun `valid workday passes validation`() {
        val wd = workDay(
            workRanges = listOf(
                TimeRange(instant(8), instant(12)),
                TimeRange(instant(13), instant(17))
            ),
            breakRanges = listOf(
                TimeRange(instant(12), instant(12, 30))
            )
        )

        // No exception thrown => valid
        validateWorkDay(wd)
    }

    @Test
    fun `sufficient break passes validation`() {
        val wd = workDay(
            workRanges = listOf(TimeRange(instant(8), instant(15))),
            breakRanges = listOf(TimeRange(instant(12), instant(12, 30))) // 30 min break
        )

        validateWorkDay(wd)
    }

    // -------------------
    // INVALID CASES
    // -------------------

    @Test
    fun `empty work times throws exception`() {
        val wd = workDay(workRanges = emptyList(), breakRanges = emptyList())

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("EMPTY_TIME_RANGE", ex.error.name)
    }

    @Test
    fun `end before start throws exception`() {
        val wd = workDay(
            workRanges = listOf(TimeRange(instant(10), instant(9))),
            breakRanges = emptyList()
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("END_BEFORE_START", ex.error.name)
    }

    @Test
    fun `overlapping time ranges throws exception`() {
        val wd = workDay(
            workRanges = listOf(
                TimeRange(instant(8), instant(12)),
                TimeRange(instant(11), instant(15))
            ),
            breakRanges = emptyList()
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("OVERLAPPING_TIME_RANGES", ex.error.name)
    }

    @Test
    fun `exceed max work duration throws exception`() {
        val wd = workDay(
            workRanges = listOf(TimeRange(instant(8), instant(19))), // 11 hours
            breakRanges = listOf(TimeRange(instant(12), instant(12, 30)))
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("MAX_WORK_TIME_EXCEEDED", ex.error.name)
    }

    @Test
    fun `break too short throws exception`() {
        val wd = workDay(
            workRanges = listOf(TimeRange(instant(8), instant(15))), // 7 hours
            breakRanges = listOf(TimeRange(instant(12), instant(12, 10))) // 10 min
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("BREAK_TOO_SHORT", ex.error.name)
    }

    @Test
    fun `insufficient total break throws exception`() {
        val wd = workDay(
            workRanges = listOf(TimeRange(instant(8), instant(17, 1))), // 9 hours, 1 minute
            breakRanges = listOf(TimeRange(instant(12), instant(12, 30))) // 30 min only
        )

        val ex = assertFailsWith<WorkDayValidationException> {
            validateWorkDay(wd)
        }
        assertEquals("INSUFFICIENT_BREAK_TIME", ex.error.name)
    }
}
