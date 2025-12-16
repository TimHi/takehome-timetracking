package timhi.timetracker.shared_sdk.validation

class WorkDayValidationException(
    val error: WorkDayValidationError
) : IllegalArgumentException(error.name)
