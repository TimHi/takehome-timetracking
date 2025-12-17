package timhi.timetracker.backend.controller

import kotlinx.datetime.LocalDate
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import timhi.timetracker.backend.service.WorkDayService
import timhi.timetracker.shared_sdk.model.WorkDay

@RestController
@RequestMapping("/api/workdays")
class WorkDayController(
    private val service: WorkDayService
) {

    /**
     * List all workdays
     */
    @GetMapping
    fun listAll(): List<WorkDay> =
        service.listAll()

    /**
     * Get a single workday by date (ISO-8601: yyyy-MM-dd)
     */
    @GetMapping("/by-date")
    fun getByDate(
        @RequestParam
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        date: java.time.LocalDate
    ): WorkDay? =
        service.getWorkDay(LocalDate.parse(date.toString()))

    /**
     * Get a single workday by id
     */
    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): WorkDay? =
        service.getWorkDayById(id)

    /**
     * Get workdays for a week (pagination by week offset)
     * offset = 0  -> current week
     * offset = 1  -> next week
     * offset = -1 -> previous week
     */
    @GetMapping("/week")
    fun getWeek(
        @RequestParam(defaultValue = "0") offset: Long
    ): List<WorkDay> =
        service.getWorkDaysForWeek(offset)

    /**
     * Create or update a workday (upsert by date)
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun upsert(@RequestBody workDay: WorkDay): WorkDay =
        service.upsert(workDay)

    /**
     * Delete a workday by id
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) {
        service.deleteById(id)
    }
}
