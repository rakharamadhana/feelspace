import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ChooseRole from './pages/ChooseRole';
import RegisterTeacher from './pages/RegisterTeacher';
import RegisterStudent from './pages/RegisterStudent';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CaseStudy from './pages/CaseStudy'; // Import the CaseStudy component
import CaseStudyDetail from './pages/CaseStudyDetail'; // Import the CaseStudy component
import CardMaker from './pages/CardMaker'; // Import the CaseStudy component
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import UsersDatabase from './components/UsersDatabase'; // Import the UsersDatabase component
import RolesDatabase from './components/RolesDatabase';


function App() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/choose-role" element={<ChooseRole />} />
                <Route path="/register-teacher" element={<RegisterTeacher />} />
                <Route path="/register-student" element={<RegisterStudent />} />
                <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
                <Route path="/teacher-dashboard" element={<ProtectedRoute element={<TeacherDashboard />} />} />
                <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
                <Route path="/case-study" element={<ProtectedRoute element={<CaseStudy />} />} />
                <Route path="/case-study-detail" element={<ProtectedRoute element={<CaseStudyDetail />} />} />
                <Route path="/card-maker" element={<ProtectedRoute element={<CardMaker />} />} />
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
                <Route path="/users-database" element={<ProtectedRoute element={<UsersDatabase />} />} />
                <Route path="/roles-database" element={<ProtectedRoute  element={<RolesDatabase />} />} />
            </Routes>
        </Router>
    );
}

export default App;
