package service

import timhi.timetracker.shared_sdk.model.JsTimeRange
import timhi.timetracker.shared_sdk.model.JsWorkDay
import timhi.timetracker.shared_sdk.service.validate
import timhi.timetracker.shared_sdk.validation.WorkDayValidationException
import kotlin.test.Test
import kotlin.test.assertFailsWith
import kotlin.time.ExperimentalTime

@OptIn(ExperimentalTime::class)
class ValidateJsWorkDayTest {

    @Test
    fun `validate valid JsWorkDay succeeds`() {
        val jsWorkDay = JsWorkDay(
            date = "2025-12-16",
            timeRanges = arrayOf(
                JsTimeRange("2025-12-16T08:00:00Z", "2025-12-16T12:00:00Z", "WORK"),
                JsTimeRange("2025-12-16T12:00:00Z", "2025-12-16T13:00:00Z", "BREAK"),
                JsTimeRange("2025-12-16T13:00:00Z", "2025-12-16T17:00:00Z", "WORK")
            )
        )

        validate(jsWorkDay)
    }

    @Test
    fun `validate JsWorkDay with empty workTimes throws exception`() {
        val jsWorkDay = JsWorkDay(
            date = "2025-12-16",
            timeRanges = arrayOf(
                JsTimeRange("2025-12-16T12:00:00Z", "2025-12-16T13:00:00Z", "BREAK")
            )
        )

        assertFailsWith<WorkDayValidationException> {
            validate(jsWorkDay)
        }
    }

    @Test
    fun `validate JsWorkDay with overlapping workTimes throws exception`() {
        val jsWorkDay = JsWorkDay(
            date = "2025-12-16",
            timeRanges = arrayOf(
                JsTimeRange("2025-12-16T08:00:00Z", "2025-12-16T12:00:00Z", "WORK"),
                JsTimeRange("2025-12-16T11:00:00Z", "2025-12-16T17:00:00Z", "WORK"),
                JsTimeRange("2025-12-16T12:00:00Z", "2025-12-16T13:00:00Z", "BREAK")
            )
        )

        assertFailsWith<WorkDayValidationException> {
            validate(jsWorkDay)
        }
    }

    @Test
    fun `validate JsWorkDay with insufficient break throws exception`() {
        val jsWorkDay = JsWorkDay(
            date = "2025-12-16",
            timeRanges = arrayOf(
                JsTimeRange("2025-12-16T08:00:00Z", "2025-12-16T12:00:00Z", "WORK"),
                JsTimeRange("2025-12-16T12:00:00Z", "2025-12-16T12:10:00Z", "BREAK"),
                JsTimeRange("2025-12-16T12:10:00Z", "2025-12-16T18:00:00Z", "WORK")
            )
        )

        assertFailsWith<WorkDayValidationException> {
            validate(jsWorkDay)
        }
    }
}