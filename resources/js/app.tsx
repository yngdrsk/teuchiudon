import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">ホーム</Link>
                <Link to="/dashboard">管理画面</Link>
            </nav>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
}

export default App;