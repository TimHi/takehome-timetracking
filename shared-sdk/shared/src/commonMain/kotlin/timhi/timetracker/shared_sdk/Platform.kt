package timhi.timetracker.shared_sdk

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform