package timhi.timetracker.shared_sdk

import kotlinx.datetime.DateTimeUnit
import kotlinx.datetime.LocalDate
import kotlinx.datetime.isoDayNumber
import kotlinx.datetime.minus
import kotlinx.datetime.plus
import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.TimeRangeType
import timhi.timetracker.shared_sdk.model.WorkDay
import kotlin.time.Duration

/* =========================
 * Work time calculations
 * ========================= */

fun WorkDay.netWorkDuration(): Duration =
    timeRanges
        .filter { it.type == TimeRangeType.WORK }
        .totalDuration()

/**
 * Optional helper if you want the raw values separately
 */
fun WorkDay.breakDuration(): Duration =
    timeRanges
        .filter { it.type == TimeRangeType.BREAK }
        .totalDuration()

fun WorkDay.grossWorkDuration(): Duration =
    netWorkDuration() + breakDuration()

/* =========================
 * TimeRange helpers
 * ========================= */

fun TimeRange.duration(): Duration =
    end - start

fun List<TimeRange>.totalDuration(): Duration =
    fold(Duration.ZERO) { acc, range -> acc + range.duration() }

fun List<TimeRange>.sortedByStart(): List<TimeRange> =
    sortedBy { it.start }

/* =========================
 * Date helpers
 * ========================= */

fun startOfWeek(date: LocalDate): LocalDate {
    val dayOfWeek = date.dayOfWeek.isoDayNumber // Monday = 1
    return date.minus(dayOfWeek - 1, DateTimeUnit.DAY)
}

fun weekRange(
    today: LocalDate,
    weekOffset: Long
): Pair<LocalDate, LocalDate> {
    val baseWeekStart = startOfWeek(today)
    val weekStart = baseWeekStart.plus(weekOffset * 7, DateTimeUnit.DAY)
    val weekEnd = weekStart.plus(7, DateTimeUnit.DAY)
    return weekStart to weekEnd
}

fun weekLabel(
    today: LocalDate,
    weekOffset: Long
): String {
    val (start, end) = weekRange(today, weekOffset)
    return "${formatDate(start)} - ${formatDate(end)}"
}

fun formatDate(date: LocalDate): String {
    val day = date.dayOfMonth.toString().padStart(2, '0')
    val month = date.monthNumber.toString().padStart(2, '0')
    val year = date.year.toString()

    return "$day.$month.$year"
}
