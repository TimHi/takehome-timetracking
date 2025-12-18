import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Button from '@mui/material/Button';
import { JsTimeRange, JsWorkDay, validate } from 'shared';
import { useWorkDays } from './hooks/useWorkDays';

function App() {
	const [count, setCount] = useState(0);
	const server = useWorkDays();
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

	useEffect(() => {
		(async () => {
			const data = await server.listAll();
			console.log(data);
		})();
	}, []);

	console.log('is Valid:', isValid);
	return (
		<>
			<div>
				<a href='https://vite.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img src={reactLogo} className='logo react' alt='React logo' />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className='card'>
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className='read-the-docs'>
				Click on the Vite and React logos to learn more
			</p>
			<Button variant='contained'>Hello world</Button>;
		</>
	);
}

export default App;
