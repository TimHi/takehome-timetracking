import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import HeaderNav from './components/HeaderNav';
import DayView from './views/DayView';
import DayEditView from './views/DayEditView';
import WeeklyView from './views/WeeklyView';
import WorkDayListView from './views/WorkDayListView';

function App() {
	return (
		<>
			<HeaderNav />
			<Routes>
				<Route path='/' element={<Navigate to='/week' replace />} />
				<Route path='/week' element={<WeeklyView />} />
				<Route path='/days' element={<WorkDayListView />} />
				<Route path='/day/:id/edit' element={<DayEditView />} />
				<Route path='/day/:id' element={<DayView />} />
				<Route path='*' element={<Navigate to='/week' replace />} />
			</Routes>
		</>
	);
}

export default App;
