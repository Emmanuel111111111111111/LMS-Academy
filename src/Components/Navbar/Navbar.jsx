import React from "react";
import styles from "./Navbar.module.css";
import { getImageUrl } from "../../utilis";

export const Navbar = () => {

    let currentPath = window.location.pathname;

    return (
        <div className={styles.theWhole}>
            <div className={styles.logo}>
                <img src={getImageUrl('Frame 349.png')} alt="CWG Academy" />
            </div>

            <div className={styles.linkList} >
                <a href="/dashboard/overview" className={(currentPath === "/dashboard/overview" || currentPath === "/dashboard/") ? styles.active : ""}>
                    <img src={getImageUrl("homeIcon.png")} />
                    Home
                </a>
                <a href="/dashboard/courses/active" className={currentPath.includes("/dashboard/courses") ? styles.active : ""}>
                    <img src={getImageUrl("coursesIcon.png")} />
                    Courses
                </a>
                <a href="/dashboard/calendar" className={currentPath.includes("/dashboard/calendar") ? styles.active : ""}>
                    <img src={getImageUrl("whiteCalendar.png")} />
                    Calendar
                </a>
                <a href="/dashboard/certificate" className={currentPath.includes("/dashboard/certificate") ? styles.active : ""}>
                    <img src={getImageUrl("certificateIcon.png")} />
                    Certificates
                </a>
            </div>

            <div className={styles.logout}>
                <a href="">
                    <img src={getImageUrl('logoutIcon.png')} />
                    Logout
                </a>
            </div>
        </div>
    )
}