package timhi.timetracker.shared_sdk.validation

//TODO_THL: Dont use exception, return error code
class WorkDayValidationException(
    val error: WorkDayValidationError
) : IllegalArgumentException(error.name)
