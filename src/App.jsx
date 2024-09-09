import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import styles from './App.module.css'
import { CWGpage } from './Page/CWGpage/CWGpage'
import { Loginpage } from './Page/Loginpage/Loginpage'
import { Accountpage } from './Page/Accountpage/Accountpage'
import { Passwordpage } from './Page/passwordpage/passwordpage'
import { Resetpage } from './Page/Resetpage/Resetpage'
import { Homepage } from './Page/Homepage/Hompage'
import { BlankPage } from './Page/BlankPage'
import { DashboardLayout } from './Page/DashboardLayout'
import { Overview } from './Page/Overviewpage/Overview'
import { Coursepage } from './Page/Coursepage/Coursepage'
import { Course } from './Components/Course/Course'
import { CalendarPage } from './Page/CalendarPage/Calendar';
import { Certificate } from './Components/Certificate/Certificate'

function App() { 

  const router = createBrowserRouter([
    { path: '/', element: <Navigate to='CWG' /> },
    { path: '/CWG', element: <CWGpage /> },
    { path: '/Login', element: <Loginpage /> },
    { path: '/Account', element: <Accountpage /> },
    { path: '/Password', element: <Passwordpage /> },
    { path: '/Reset', element: <Resetpage /> },
    { path: '/Home', element: <Homepage /> },
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
  ])


  return (
    <div className={styles.App}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App



