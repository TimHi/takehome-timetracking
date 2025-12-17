package timhi.timetracker.backend

import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDate
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay
import timhi.timetracker.shared_sdk.validateWorkDay

@SpringBootApplication
class BackendApplication


fun dummyCallValidateWorkDay() {
    // Create some dummy time ranges
    val workTime1 = TimeRange(
        start = Instant.parse("2025-12-17T08:00:00Z"),
        end = Instant.parse("2025-12-17T12:00:00Z")
    )
    val workTime2 = TimeRange(
        start = Instant.parse("2025-12-17T13:00:00Z"),
        end = Instant.parse("2025-12-17T17:00:00Z")
    )
    val breakTime = TimeRange(
        start = Instant.parse("2025-12-17T12:00:00Z"),
        end = Instant.parse("2025-12-17T13:00:00Z")
    )

    // Create a WorkDay
    val workDay = WorkDay(
        date = LocalDate(2025, 12, 17),
        workTimes = listOf(workTime1, workTime2),
        breakTimes = listOf(breakTime)
    )

    // Call the validation function
    val result = validateWorkDay(workDay)
    println(result)
}

fun main(args: Array<String>) {
    dummyCallValidateWorkDay()
    runApplication<BackendApplication>(*args)
}
