import { useState, useEffect } from 'react';
import { Navigate, Routes, Route, RouterProvider, createBrowserRouter } from 'react-router-dom';
import styles from './App.module.css'

import { CWGpage } from './Page/CWGpage/CWGpage'
import { Loginpage } from './Page/Loginpage/Loginpage'
import { AdminLogin } from './Admin/Page/AdminOnboarding/AdminLogin';
import { Accountpage } from './Page/Accountpage/Accountpage'
import { Password } from './Page/Password/Password';
import { Resetpage } from './Page/Resetpage/Resetpage'
import { AdminReset } from './Admin/Page/AdminOnboarding/AdminReset';
import { NewAdmin } from './Admin/Page/AdminOnboarding/NewAdmin';

import { DashboardLayout } from './Page/DashboardLayout'
import { BlankPage } from './Page/BlankPage'
import { PageNotFound } from './Page/404';

import { Overview } from './Page/Overviewpage/Overview'
import { Course } from './Page/Course/Course'
import { CompletedCourse } from './Page/CompletedCourses/CompletedCourses';
import { CourseDetails } from './Page/CourseDetails/CourseDetails';
import { CalendarPage } from './Page/CalendarPage/Calendar';
import { Certificate } from './Components/Certificate/Certificate'

import { AdminDashboardLayout } from './Admin/Page/AdminDashboardLayout';
import { AdminOverview } from './Admin/Page/AdminOverviewpage/AdminOverview';
import { AllCourses } from './Admin/Page/Courses/AllCourses';
import { ActiveCourses } from './Admin/Page/Courses/ActiveCourses';
import { UpcomingCourses } from './Admin/Page/Courses/UpcomingCourses';
import { CompletedCourses } from './Admin/Page/Courses/CompletedCourses';
import { SchedulePage } from './Admin/Page/SchedulePage/SchedulePage';
import { TeachersPage } from './Admin/Page/TeacherPage/TeacherPage';
import { StudentPage } from './Admin/Page/StudentPage/StudentPage';
import { PendingStudentPage } from './Admin/Page/StudentPage/PendingStudentPage';
import { ActivityLogPage } from './Admin/Page/ActivityLogPage/ActivityLogPage';
import { CourseDetail } from './Admin/Page/Courses/CourseDetail';
import { CohortPage } from './Admin/Page/CohortPage/CohortPage';
import { CohortDetails } from './Admin/Page/CohortPage/CohortDetails';
import { ClassDetails } from './Admin/Page/ClassesPage/ClassDetails';
import { TaskPage } from './Admin/Page/TaskPage/TaskPage';
import { Classes } from './Admin/Page/ClassesPage/Classes';

import { ProfilePage } from './Page/ProfilePage/ProfilePage';


const ProtectedRoute = ({ children }) => {

  const authToken = sessionStorage.getItem("type");
  if ((!authToken) || (authToken != "student")) {
    window.location.href = "/login";
  }
  return children;
};


const AdminProtectedRoute = ({ children }) => {

  const authToken = sessionStorage.getItem("type");
  if ((!authToken) || (authToken != "teacher")) {
    window.location.href = "/admin-login";
  }
  return children;
};


function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Navigate to='CWG' /> },
    { path: '/CWG', element: <CWGpage /> },
    { path: '/Login', element: <Loginpage /> },
    { path: '/Admin-login', element: <AdminLogin /> },
    { path: '/new-admin/:id', element: <NewAdmin /> },
    { path: '/Account', element: <Accountpage /> },
    { path: '/Password', element: <Password /> },
    { path: '/Reset', element: <Resetpage /> },
    { path: '/admin-reset', element: <AdminReset /> },
    { path: '/blank', element: <BlankPage /> },

    { path: '/404', element: <PageNotFound /> },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/dashboard', element: <Navigate to="overview" /> },
        { path: 'overview', element: <Overview /> },
        { path: 'courses', element: <Navigate to="active" /> },
        { path: 'courses/active', element: <Course /> },
        { path: 'courses/completed', element: <CompletedCourse /> },
        { path: 'courses/detail/:courseId', element: <CourseDetails /> },
        { path: 'calendar', element: <CalendarPage /> },
        { path: 'certificate', element: <Certificate /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'profile/:id', element: <ProfilePage /> },
        { path: 'settings', element: <BlankPage /> },
       
      ]
    },
    {
      path: '/admin-dashboard',
      element: (
        <AdminProtectedRoute>
          <AdminDashboardLayout />
        </AdminProtectedRoute>
      ),
      children: [
        { path: '/admin-dashboard', element: <Navigate to="overview" /> },
        { path: 'overview', element: <AdminOverview /> },
        { path: 'schedule', element: <SchedulePage /> },
        { path: 'courses', element: <AllCourses /> },
        { path: 'courses/active', element: <ActiveCourses /> },
        { path: 'courses/upcoming', element: <UpcomingCourses /> },
        { path: 'courses/completed', element: <CompletedCourses /> },
        { path: 'courses/detail', element: <CourseDetail /> },
        { path: 'courses/detail/:courseId', element: <CourseDetail /> },
        { path: 'cohort', element: <CohortPage /> },
        { path: 'cohort/:id', element: <CohortDetails /> },
        { path: 'classes', element: <Classes /> },
        { path: 'classes/:id', element: <ClassDetails /> },
        { path: 'tasks', element: <TaskPage /> },
        { path: 'teacher', element: <TeachersPage /> },
        { path: 'student', element: <StudentPage /> },
        { path: 'student/pending', element: <PendingStudentPage /> },
        { path: 'activitylog', element: <ActivityLogPage /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'profile/:id', element: <ProfilePage /> },
      ]
    },
  ])


  return (
    <div className={styles.App}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App



