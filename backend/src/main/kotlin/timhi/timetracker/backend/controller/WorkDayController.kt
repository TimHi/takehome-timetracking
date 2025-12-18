package timhi.timetracker.backend.controller

import kotlinx.datetime.LocalDate
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import timhi.timetracker.backend.dto.WorkDayDto
import timhi.timetracker.backend.mappers.toDto
import timhi.timetracker.backend.service.WorkDayService
import timhi.timetracker.shared_sdk.model.WorkDay

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
    fun upsert(@RequestBody workDay: WorkDay): WorkDayDto =
        service.upsert(workDay).toDto()

    /** Delete a workday by id */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        service.deleteById(id)
    }
}
