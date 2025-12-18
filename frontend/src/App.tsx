import './App.css';
import { JsTimeRange, JsWorkDay, validate } from 'shared';
import { WeeklyView } from './views/WeeklyView';

function App() {
	const wt = [
		new JsTimeRange('2025-12-16T08:00:00Z', '2025-12-16T12:00:00Z'),
		new JsTimeRange('2025-12-16T13:00:00Z', '2025-12-16T17:00:00Z'),
	];

	const bt = [new JsTimeRange('2025-12-16T12:00:00Z', '2025-12-16T12:30:00Z')];

	const wd = new JsWorkDay('2025-12-16', wt, bt);

	// --- 4️⃣ Validate ---
	let isValid = false;

	try {
		validate(wd); // Calls Kotlin validator
		isValid = true;
	} catch (e) {
		console.error('Validation failed:', e);
	}

	console.log('is Valid:', isValid);
	return (
		<>
			<WeeklyView />
		</>
	);
}

export default App;
