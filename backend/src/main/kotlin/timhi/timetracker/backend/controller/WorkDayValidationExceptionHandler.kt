package timhi.timetracker.backend.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import timhi.timetracker.shared_sdk.validation.WorkDayValidationError
import timhi.timetracker.shared_sdk.validation.WorkDayValidationException

@RestControllerAdvice
class WorkDayValidationExceptionHandler {

    @ExceptionHandler(WorkDayValidationException::class)
    fun handleWorkDayValidation(
        ex: WorkDayValidationException
    ): ResponseEntity<WorkDayValidationErrorResponse> =
        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            WorkDayValidationErrorResponse(
                error = ex.error,
                message = ex.error.name
            )
        )
}

data class WorkDayValidationErrorResponse(
    val error: WorkDayValidationError,
    val message: String
)
