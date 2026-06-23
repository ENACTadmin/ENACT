import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Auth
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Static
import AboutPage from './pages/staticPages/AboutPage';
import ContactPage from './pages/staticPages/ContactPage';
import HelpPage from './pages/staticPages/HelpPage';
import AccountHelpPage from './pages/staticPages/AccountHelpPage';

// Events
import EventsPage from './pages/events/EventsPage';

// Profiles
import FacultyListPage from './pages/profiles/FacultyListPage';

// Courses
import CourseSchedulePage from './pages/courses/CourseSchedulePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/app">
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Home & auth */}
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />

            {/* Static pages */}
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="accountHelp" element={<AccountHelpPage />} />

            {/* Events */}
            <Route path="events" element={<EventsPage />} />

            {/* Profiles */}
            <Route path="profiles/view/faculty" element={<FacultyListPage />} />

            {/* Courses */}
            <Route path="courses/schedule" element={<CourseSchedulePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
