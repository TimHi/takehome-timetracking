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
            dateIso = "2025-12-16",
            workTimesArray = arrayOf(
                JsTimeRange("2025-12-16T08:00:00Z", "2025-12-16T12:00:00Z"),
                JsTimeRange("2025-12-16T13:00:00Z", "2025-12-16T17:00:00Z")
            ),
            breakTimesArray = arrayOf(
                JsTimeRange("2025-12-16T12:00:00Z", "2025-12-16T13:00:00Z")
            )
        )

        // Should not throw
        validate(jsWorkDay)
    }

    @Test
    fun `validate JsWorkDay with empty workTimes throws exception`() {
        val jsWorkDay = JsWorkDay(
            dateIso = "2025-12-16",
            workTimesArray = arrayOf(),
            breakTimesArray = arrayOf(
                JsTimeRange("2025-12-16T12:00:00Z", "2025-12-16T13:00:00Z")
            )
        )

        assertFailsWith<WorkDayValidationException> {
            validate(jsWorkDay)
        }
    }

    @Test
    fun `validate JsWorkDay with overlapping workTimes throws exception`() {
        val jsWorkDay = JsWorkDay(
            dateIso = "2025-12-16",
            workTimesArray = arrayOf(
                JsTimeRange("2025-12-16T08:00:00Z", "2025-12-16T12:00:00Z"),
                JsTimeRange("2025-12-16T11:00:00Z", "2025-12-16T17:00:00Z") // overlaps
            ),
            breakTimesArray = arrayOf(
                JsTimeRange("2025-12-16T12:00:00Z", "2025-12-16T13:00:00Z")
            )
        )

        assertFailsWith<WorkDayValidationException> {
            validate(jsWorkDay)
        }
    }
}
