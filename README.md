# takehome-timetracking
Time-tracking app for logging daily work, breaks, and other ranges.
View the week at a glance and manage entries.

## How to start
Use these steps to run the full stack locally.
- Build the shared Kotlin module (KMP) with gradle task `:shared:jsBrowserDevelopmentLibraryDistribution` or `:shared:jsBrowserProductionLibraryDistribution` from `shared-sdk`.
- Start the Spring Boot backend by creating a run configuration or right clicking `backend/src/main/kotlin/BackendApplication.kt` -> Run.
- In the `frontend` folder install dependencies with `npm i`.
- Start the frontend with `npm run dev` and open the local URL it prints.

## Tests
Run tests from each module root.
- Frontend: `npm run test` (watch) or `npm run test:run` (CI mode) from `frontend`.
- Backend: `./gradlew test` from `backend`.
- Shared KMP: `./gradlew :shared:test` from `shared-sdk`.

## Technical overview of the chosen techs
Repository layout at a glance.
- Frontend uses React 19.2.
- Backend uses Spring Boot 3.5.8.
- KMP uses Kotlin 2.2.21.

## Architecture diagram
High-level view of how the pieces fit together.

```
          +----------------------+
          |  Shared Kotlin (KMP) |
          +----------+-----------+
                     |
   +-----------------+-----------------+
   |                                   |
+--v-----------+                 +-----v----------------+
| Frontend     |  HTTP/JSON API  | Backend (Spring Boot)|
| (React/Vite) +---------------->+----------------------+
+--------------+                 | Persistence (H2)     |
                                 +----------+-----------+
                                            |
                                        +---v---+
                                        |  DB  |
                                        +-------+
```
