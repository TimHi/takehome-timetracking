package timhi.timetracker.shared_sdk

import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay
import timhi.timetracker.shared_sdk.policy.WorkTimePolicy
import timhi.timetracker.shared_sdk.validation.WorkDayValidationError
import timhi.timetracker.shared_sdk.validation.WorkDayValidationException

import kotlin.time.Duration

fun validateWorkDay(workDay: WorkDay) {
        validateTimeRanges(workDay.workTimes)
        validateTimeRanges(workDay.breakTimes)

        validateMaxWorkTime(workDay.workTimes)
        validateBreakRules(
            workDay.workTimes,
            workDay.breakTimes
        )
    }

    private fun validateTimeRanges(ranges: List<TimeRange>) {
        if (ranges.isEmpty()) {
            throw WorkDayValidationException(
                WorkDayValidationError.EMPTY_TIME_RANGE
            )
        }

        ranges.forEach {
            if (it.end <= it.start) {
                throw WorkDayValidationException(
                    WorkDayValidationError.END_BEFORE_START
                )
            }
        }

        val sorted = ranges.sortedByStart()
        sorted.zipWithNext { a, b ->
            if (b.start < a.end) {
                throw WorkDayValidationException(
                    WorkDayValidationError.OVERLAPPING_TIME_RANGES
                )
            }
        }
    }

    private fun validateMaxWorkTime(workTimes: List<TimeRange>) {
        if (workTimes.totalDuration() > WorkTimePolicy.MAX_WORK_DURATION) {
            throw WorkDayValidationException(
                WorkDayValidationError.MAX_WORK_TIME_EXCEEDED
            )
        }
    }

    private fun validateBreakRules(
        workTimes: List<TimeRange>,
        breakTimes: List<TimeRange>
    ) {
        val workDuration = workTimes.totalDuration()
        val breakDuration = breakTimes.totalDuration()

        breakTimes.forEach {
            if (it.duration() < WorkTimePolicy.MIN_SINGLE_BREAK) {
                throw WorkDayValidationException(
                    WorkDayValidationError.BREAK_TOO_SHORT
                )
            }
        }

        val requiredBreak: Duration = when {
            workDuration > WorkTimePolicy.BREAK_REQUIRED_AFTER_9H ->
                WorkTimePolicy.MIN_BREAK_AFTER_9H

            workDuration > WorkTimePolicy.BREAK_REQUIRED_AFTER_6H ->
                WorkTimePolicy.MIN_BREAK_AFTER_6H

            else -> Duration.ZERO
        }

        if (breakDuration < requiredBreak) {
            throw WorkDayValidationException(
                WorkDayValidationError.INSUFFICIENT_BREAK_TIME
            )
        }
    }
