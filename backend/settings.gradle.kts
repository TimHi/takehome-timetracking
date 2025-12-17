rootProject.name = "backend"
rootProject.name = "backend"

includeBuild("../shared-sdk") {
    dependencySubstitution {
        substitute(module("timhi.timetracker.shared_sdk:shared")).using(project(":shared"))
    }
}