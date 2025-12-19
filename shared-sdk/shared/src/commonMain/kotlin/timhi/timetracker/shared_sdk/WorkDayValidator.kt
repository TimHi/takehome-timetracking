package timhi.timetracker.shared_sdk

import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.TimeRangeType
import timhi.timetracker.shared_sdk.model.WorkDay
import timhi.timetracker.shared_sdk.policy.WorkTimePolicy
import timhi.timetracker.shared_sdk.validation.WorkDayValidationError
import timhi.timetracker.shared_sdk.validation.WorkDayValidationException
import kotlin.time.Duration

/* =========================
 * Public API
 * ========================= */

fun validateWorkDay(workDay: WorkDay) {
    validateTimeRanges(workDay.timeRanges)
    validateNoOverlapsAcrossDay(workDay.timeRanges)

    val workTimes = workDay.timeRanges.filter { it.type == TimeRangeType.WORK }
    if (workTimes.isEmpty()) {
        throw WorkDayValidationException(WorkDayValidationError.EMPTY_WORK_TIME)
    }

    validateMaxWorkTime(workDay)
    validateBreakRules(workDay)
}

/* =========================
 * Time range validations
 * ========================= */

private fun validateTimeRanges(ranges: List<TimeRange>) {
    if (ranges.isEmpty()) {
        throw WorkDayValidationException(
            WorkDayValidationError.EMPTY_TIME_RANGE
        )
    }

    ranges.forEach { range ->
        if (range.end <= range.start) {
            throw WorkDayValidationException(
                WorkDayValidationError.END_BEFORE_START
            )
        }
    }
}

/**
 * Unified timeline validation:
 * - Adjacent ranges allowed
 * - Any real overlap is forbidden
 */
private fun validateNoOverlapsAcrossDay(
    ranges: List<TimeRange>
) {
    val sorted = ranges.sortedByStart()

    sorted.zipWithNext { a, b ->
        if (rangesOverlap(a, b)) {
            throw WorkDayValidationException(
                WorkDayValidationError.TIME_RANGES_OVERLAP
            )
        }
    }
}

/* =========================
 * Work & break rules
 * ========================= */

private fun validateMaxWorkTime(workDay: WorkDay) {
    val workDuration = workDay
        .timeRanges
        .filter { it.type == TimeRangeType.WORK }
        .totalDuration()

    if (workDuration > WorkTimePolicy.MAX_WORK_DURATION) {
        throw WorkDayValidationException(
            WorkDayValidationError.MAX_WORK_TIME_EXCEEDED
        )
    }
}

private fun validateBreakRules(workDay: WorkDay) {
    val breaks = workDay.timeRanges.filter { it.type == TimeRangeType.BREAK }
    val workDuration = workDay.timeRanges
        .filter { it.type == TimeRangeType.WORK }
        .totalDuration()

    breaks.forEach { breakTime ->
        if (breakTime.duration() < WorkTimePolicy.MIN_SINGLE_BREAK) {
            throw WorkDayValidationException(
                WorkDayValidationError.BREAK_TOO_SHORT
            )
        }
    }

    val requiredBreak = requiredBreakDuration(workDuration)
    val totalBreakDuration = breaks.totalDuration()

    if (totalBreakDuration < requiredBreak) {
        throw WorkDayValidationException(
            WorkDayValidationError.INSUFFICIENT_BREAK_TIME
        )
    }
}

private fun requiredBreakDuration(workDuration: Duration): Duration =
    when {
        workDuration > WorkTimePolicy.BREAK_REQUIRED_AFTER_9H ->
            WorkTimePolicy.MIN_BREAK_AFTER_9H

        workDuration > WorkTimePolicy.BREAK_REQUIRED_AFTER_6H ->
            WorkTimePolicy.MIN_BREAK_AFTER_6H

        else -> Duration.ZERO
    }

/* =========================
 * Utilities
 * ========================= */

private fun rangesOverlap(a: TimeRange, b: TimeRange): Boolean =
    a.start < b.end && b.start < a.end
