import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import styles from './App.module.css'
import { CWGpage } from './Page/CWGpage/CWGpage'
import { Loginpage } from './Page/Loginpage/Loginpage'
import { Accountpage } from './Page/Accountpage/Accountpage'
import { Passwordpage } from './Page/Passwordpage/Passwordpage'
import { Resetpage } from './Page/Resetpage/Resetpage'
import { BlankPage } from './Page/BlankPage'
import { DashboardLayout } from './Page/DashboardLayout'
import { Overview } from './Page/Overviewpage/Overview'
import { Coursepage } from './Page/Coursepage/Coursepage'
import { Course } from './Components/Course/Course'
import { CalendarPage } from './Page/CalendarPage/Calendar';
import { Certificate } from './Components/Certificate/Certificate'
import { AdminDashboardLayout } from './Admin/Page/AdminDashboardLayout';
import { AdminLoginPage } from './Admin/Page/AdminLoginPage/AdminLoginPage';
import { AdminCourse } from './Admin/Components/AdminCourse/AdminCourse';
import { SchedulePage } from './Admin/Page/SchedulePage/SchedulePage';
import { TeachersPage } from './Admin/Page/TeacherPage/TeacherPage';
import { StudentPage } from './Admin/Page/StudentPage/StudentPage';
import { PendingStudentPage } from './Admin/Page/PendingStudentsPage/PendingStudentPage';
import { ActivityLogPage } from './Admin/Page/ActivityLogPage/ActivityLogPage';
import { AdminOverview } from './Admin/Page/AdminOverviewpage/AdminOverview';

function App() { 

  const router = createBrowserRouter([
    { path: '/', element: <Navigate to='CWG' /> },
    { path: '/CWG', element: <CWGpage /> },
    { path: '/Login', element: <Loginpage /> },
    { path: '/Admin-login', element: <AdminLoginPage /> },
    { path: '/Account', element: <Accountpage /> },
    { path: '/Password', element: <Passwordpage /> },
    { path: '/Reset', element: <Resetpage /> },
    {
      path: '/dashboard', element: <DashboardLayout />,
      children: [
        { path: '/dashboard', element: <Navigate to="overview" /> },
        { path: 'overview', element: <Overview /> },
        { path: 'courses', element: <Coursepage /> },
        { path: 'courses/active', element: <Course /> },
        { path: 'courses/completed', element: <BlankPage /> },
        { path: 'calendar', element: <CalendarPage /> },
        { path: 'certificate', element: <Certificate /> },
      ]
    },
    {
      path: '/admin-dashboard', element: <AdminDashboardLayout />,
      children: [
        { path: '/admin-dashboard', element: <Navigate to="overview" /> },
        { path: 'overview', element: <AdminOverview /> },
        { path: 'schedule', element: <SchedulePage /> },
        { path: 'courses', element: <AdminCourse /> },
        { path: 'courses/active', element: <AdminCourse /> },
        { path: 'courses/completed', element: <BlankPage /> },
        { path: 'tasks', element: <BlankPage /> },
        { path: 'teacher', element: <TeachersPage /> },
        { path: 'student', element: <StudentPage /> },
        { path: 'student/pending', element: <PendingStudentPage /> },
        { path: 'activitylog', element: <ActivityLogPage /> },
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



