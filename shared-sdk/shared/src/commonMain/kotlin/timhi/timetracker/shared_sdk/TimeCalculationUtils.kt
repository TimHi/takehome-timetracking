package timhi.timetracker.shared_sdk

import timhi.timetracker.shared_sdk.model.TimeRange
import timhi.timetracker.shared_sdk.model.WorkDay
import kotlin.time.Duration

fun calculateNetWorkTime(
    workTimes: List<TimeRange>,
    breakTimes: List<TimeRange>
): Duration =
    workTimes.totalDuration() - breakTimes.totalDuration()

fun WorkDay.netWorkDuration(): Duration =
    calculateNetWorkTime(workTimes, breakTimes)

fun TimeRange.duration(): Duration =
    end - start

fun List<TimeRange>.totalDuration(): Duration =
    fold(Duration.ZERO) { acc, range -> acc + range.duration() }

fun List<TimeRange>.sortedByStart(): List<TimeRange> =
    sortedBy { it.start }