import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {HomePage, JobDetailPage } from './pages';
import './App.css';


const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
            </Routes>
        </Router>
    );
};

export default App;
