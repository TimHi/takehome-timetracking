package timhi.timetracker.shared_sdk.policy

import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

object WorkTimePolicy {
    /** ArbZG §3 */
    val MAX_WORK_DURATION: Duration = 10.hours
    /** ArbZG §4 */
    val BREAK_REQUIRED_AFTER_6H: Duration = 6.hours
    val BREAK_REQUIRED_AFTER_9H: Duration = 9.hours
    val MIN_BREAK_AFTER_6H: Duration = 30.minutes
    val MIN_BREAK_AFTER_9H: Duration = 45.minutes
    val MIN_SINGLE_BREAK: Duration = 15.minutes
}