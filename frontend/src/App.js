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
import CardMakerCreate from './pages/CardMakerCreate'; // Import the CaseStudy component
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import UsersDatabase from './components/UsersDatabase'; // Import the UsersDatabase component
import RolesDatabase from './components/RolesDatabase';
import CasesDatabase from './components/CasesDatabase'; // Import the CasesDatabase component
import CaseDetailsResponse from './pages/CaseDetailsResponse'; // Import the CaseDetailsResponse component
import CasesResponse from './pages/CasesResponse'; // Import the AllResponses component
import Draw from "./pages/Draw";


function App() {
    return (
        <Router>
            <Routes>
                {/*All*/}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/choose-role" element={<ChooseRole />} />
                <Route path="/register-teacher" element={<RegisterTeacher />} />
                <Route path="/register-student" element={<RegisterStudent />} />
                <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />

                {/*Backend*/}
                <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
                <Route path="/teacher-dashboard" element={<ProtectedRoute element={<TeacherDashboard />} />} />
                <Route path="/users-database" element={<ProtectedRoute element={<UsersDatabase />} />} />
                <Route path="/roles-database" element={<ProtectedRoute element={<RolesDatabase />} />} />
                <Route path="/cases-database" element={<ProtectedRoute element={<CasesDatabase />} />} />
                <Route path="/cases-responses" element={<ProtectedRoute element={<CasesResponse />} />} /> {/* New Route */}
                <Route path="/case-details/:id/responses" element={<ProtectedRoute element={<CaseDetailsResponse />} />} />

                {/*Frontend*/}
                <Route path="/student-dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
                <Route path="/case-study" element={<ProtectedRoute element={<CaseStudy />} />} />
                <Route path="/case-study/detail/:id" element={<ProtectedRoute element={<CaseStudyDetail />} />} />
                <Route path="/card-maker" element={<ProtectedRoute element={<CardMaker />} />} />
                <Route path="/card-maker/draw" element={<ProtectedRoute element={<Draw />} />} />
                <Route path="/card-maker/create" element={<ProtectedRoute element={<CardMakerCreate />} />} />
            </Routes>
        </Router>
    );
}

export default App;

