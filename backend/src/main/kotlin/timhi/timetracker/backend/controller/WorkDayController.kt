package timhi.timetracker.backend.controller

import kotlinx.datetime.Clock
import kotlinx.datetime.LocalDate
import kotlinx.datetime.TimeZone
import kotlinx.datetime.todayIn
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import timhi.timetracker.backend.dto.WeekLabelDto
import timhi.timetracker.backend.dto.WorkDayDto
import timhi.timetracker.backend.dto.WorkDayDurations
import timhi.timetracker.backend.mappers.toDto
import timhi.timetracker.backend.mappers.toWorkDay
import timhi.timetracker.backend.persistance.toWorkDay
import timhi.timetracker.backend.request.WorkDayUpsertRequest
import timhi.timetracker.backend.service.WorkDayService
import timhi.timetracker.shared_sdk.breakDuration
import timhi.timetracker.shared_sdk.model.WorkDay
import timhi.timetracker.shared_sdk.netWorkDuration
import timhi.timetracker.shared_sdk.toHHmm
import timhi.timetracker.shared_sdk.validateWorkDay
import timhi.timetracker.shared_sdk.validation.WorkDayValidationError
import timhi.timetracker.shared_sdk.validation.WorkDayValidationException
import timhi.timetracker.shared_sdk.weekLabel
import kotlin.time.Duration
import kotlin.time.DurationUnit

@RestController
@CrossOrigin
@RequestMapping("/api/workdays")
class WorkDayController(
    private val service: WorkDayService
) {

    /** List all workdays */
    @GetMapping
    fun listAll(): List<WorkDayDto> =
        service.listAll().map { it.toDto() }

    /** Get a single workday by date (ISO-8601: yyyy-MM-dd) */
    @GetMapping("/by-date")
    fun getByDate(
        @RequestParam
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        date: java.time.LocalDate
    ): WorkDayDto? =
        service.getWorkDay(LocalDate.parse(date.toString()))?.toDto()

    /** Get a single workday by id */
    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): WorkDayDto? =
        service.getWorkDayById(id)?.toDto()

    /** Get workdays for a week (pagination by week offset) */
    @GetMapping("/week")
    fun getWeek(
        @RequestParam(defaultValue = "0") offset: Long
    ): List<WorkDayDto> =
        service.getWorkDaysForWeek(offset).map { it.toDto() }

    /** Create or update a workday (upsert by date) */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun upsert(@RequestBody req: WorkDayUpsertRequest): WorkDayDto =
        service.upsert(req.toWorkDay()).toDto()

    /** Delete a workday by id */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        service.deleteById(id)
    }

    @GetMapping("/week-label")
    fun getWeekLabel(
        @RequestParam(defaultValue = "0") offset: Long
    ): String {
        val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
        return weekLabel(today, offset)
    }

    @PostMapping("/validate")
    fun validate(@RequestBody workDay: WorkDayDto): ValidationResponse {
        val hasEmptyRange = workDay.timeRanges.any { range ->
            range.start.isBlank() || range.end.isBlank()
        }
        if (hasEmptyRange) {
            return ValidationResponse(
                valid = false,
                error = WorkDayValidationError.EMPTY_TIME_RANGE.name
            )
        }

        // Convert once so we validate the real domain model
        val domain = workDay.toWorkDay()

        // 1) Check uniqueness (by date)
        val existing = service.getWorkDay(domain.date) 
        val isConflict = existing != null && existing.id != domain.id
        if (isConflict) {
            return ValidationResponse(
                valid = false,
                error = "Arbeitstag ${domain.date} existiert bereits."
            )
        }

        // 2) Run business validation
        return try {
            validateWorkDay(domain)
            ValidationResponse(valid = true)
        } catch (e: WorkDayValidationException) {
            ValidationResponse(valid = false, error = e.message)
        }
    }

    @GetMapping("/day-duration")
    fun getWorkdayDurations(
        @RequestParam id: Long
    ): WorkDayDurations {
        val workDay = service.getWorkDayById(id)?.toDto()
        val workDuration =
            workDay?.toWorkDay()?.netWorkDuration() ?: Duration.ZERO

        val breakDuration =
            workDay?.toWorkDay()?.breakDuration() ?: Duration.ZERO

       return WorkDayDurations(workDuration.toHHmm(), breakDuration.toHHmm())
    }
}
data class ValidationResponse(
    val valid: Boolean,
    val error: String? = null
)
