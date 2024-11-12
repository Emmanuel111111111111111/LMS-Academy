import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import styles from './App.module.css'
import { CWGpage } from './Page/CWGpage/CWGpage'
import { Loginpage } from './Page/Loginpage/Loginpage'
import { Accountpage } from './Page/Accountpage/Accountpage'
import { Resetpage } from './Page/Resetpage/Resetpage'
import { BlankPage } from './Page/BlankPage'
import { DashboardLayout } from './Page/DashboardLayout'
import { Overview } from './Page/Overviewpage/Overview'
import { Course } from './Page/Course/Course'
import { CalendarPage } from './Page/CalendarPage/Calendar';
import { Certificate } from './Components/Certificate/Certificate'
import { AdminDashboardLayout } from './Admin/Page/AdminDashboardLayout';
import { AdminLoginPage } from './Admin/Page/AdminLoginPage/AdminLoginPage';
import { SchedulePage } from './Admin/Page/SchedulePage/SchedulePage';
import { TeachersPage } from './Admin/Page/TeacherPage/TeacherPage';
import { StudentPage } from './Admin/Page/StudentPage/StudentPage';
import { PendingStudentPage } from './Admin/Page/PendingStudentsPage/PendingStudentPage';
import { ActivityLogPage } from './Admin/Page/ActivityLogPage/ActivityLogPage';
import { AdminOverview } from './Admin/Page/AdminOverviewpage/AdminOverview';
import { UpcomingCourses } from './Admin/Page/UpcomingCourses/UpcomingCourses';
import { CompletedCourses } from './Admin/Page/CompletedCourses/CompletedCourses';
import { AllCourses } from './Admin/Page/AllCourses/AllCourses';
import { CompletedCourse } from './Page/CompletedCourses/CompletedCourses';
import { CourseDetail } from './Admin/Components/CourseDetail/CourseDetail';
import { ActiveCourses } from './Admin/Page/ActiveCourses/ActiveCourses';
import { CourseDetails } from './Page/CourseDetails/CourseDetails';
import { Password } from './Page/Password/Password';
import { ProfilePage } from './Page/ProfilePage/ProfilePage';
import { CohortPage } from './Admin/Page/CohortPage/CohortPage';
import { CohortDetails } from './Admin/Page/CohortPage/CohortDetails';
import { ClassDetails } from './Admin/Page/ClassDetails/ClassDetails';
import { TaskPage } from './Admin/Page/TaskPage/TaskPage';
import { Classes } from './Admin/Page/Classes/Classes';

function App() { 

  const router = createBrowserRouter([
    { path: '/', element: <Navigate to='CWG' /> },
    { path: '/CWG', element: <CWGpage /> },
    { path: '/Login', element: <Loginpage /> },
    { path: '/Admin-login', element: <AdminLoginPage /> },
    { path: '/Account', element: <Accountpage /> },
    { path: '/Password', element: <Password /> },
    { path: '/Reset', element: <Resetpage /> },
    {
      path: '/dashboard', element: <DashboardLayout />,
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
      path: '/admin-dashboard', element: <AdminDashboardLayout />,
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



