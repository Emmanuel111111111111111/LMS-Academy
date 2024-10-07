import React from "react";
import styles from "./AdminNavbar.module.css";
import { getImageUrl } from "../../../utilis";

export const AdminNavbar = () => {

    let currentPath = window.location.pathname;

    return (
        <div className={styles.theWhole}>
            <div className={styles.logo}>
                <img src={getImageUrl('Frame 349.png')} alt="CWG Academy" />
            </div>

            <div className={styles.linkList} >
                <a href="/admin-dashboard/overview" className={currentPath === "/admin-dashboard/overview" ? styles.active : ""}>
                    <img src={getImageUrl("homeIcon.png")} />
                    Home
                </a>
                <a href="/admin-dashboard/schedule" className={currentPath.includes("/admin-dashboard/schedule") ? styles.active : ""}>
                    <img src={getImageUrl("calendarIcon.png")} />
                    Schedule
                </a>
                <a href="/admin-dashboard/courses" className={currentPath.includes("/admin-dashboard/courses") ? styles.active : ""}>
                    <img src={getImageUrl("coursesIcon.png")} />
                    Courses
                </a>
                <a href="/admin-dashboard/tasks" className={currentPath.includes("/admin-dashboard/tasks") ? styles.active : ""}>
                    <img src={getImageUrl("certificateIcon.png")} />
                    Tasks
                </a>
                <a href="/admin-dashboard/teacher" className={currentPath.includes("/admin-dashboard/teacher") ? styles.active : ""}>
                    <img src={getImageUrl("coursesIcon.png")} />
                    Teacher
                </a>
                <a href="/admin-dashboard/student" className={currentPath.includes("/admin-dashboard/student") ? styles.active : ""}>
                    <img src={getImageUrl("coursesIcon.png")} />
                    Student
                </a>
                <a href="/admin-dashboard/activitylog" className={currentPath.includes("/admin-dashboard/activitylog") ? styles.active : ""}>
                    <img src={getImageUrl("coursesIcon.png")} />
                    Activity Log
                </a>
            </div>

            <div className={styles.logout}>
                <a href="/CWG">
                    <img src={getImageUrl('logoutIcon.png')} />
                    Logout
                </a>
            </div>
        </div>
    )
}