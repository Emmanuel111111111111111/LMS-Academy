import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { getImageUrl } from "../../../utilis";


export const AdminHeader = () => {

    let currentPath = window.location.pathname;
    let PageTitle;
    let linkList = [];

    if (
        currentPath === "/" ||
        currentPath === "/admin-dashboard" ||
        currentPath === "/admin-dashboard/" ||
        currentPath === "/admin-dashboard/overview" ||
        currentPath === "/admin-dashboard/overview/"
    ) {
        PageTitle = "Home";
        linkList= [];
    }
    else if (currentPath === "/admin-dashboard/schedule") {
        PageTitle = "Schedule";
        linkList= [];
    }
    else if (
        currentPath === "/admin-dashboard/courses/" ||
        currentPath === "/admin-dashboard/courses" ||
        currentPath === "/admin-dashboard/courses/active" ||
        currentPath === "/admin-dashboard/courses/active/" ||
        currentPath === "/admin-dashboard/courses/upcoming" ||
        currentPath === "/admin-dashboard/courses/upcoming/" ||
        currentPath === "/admin-dashboard/courses/completed" ||
        currentPath === "/admin-dashboard/courses/completed/"
    ) {
        PageTitle = "Courses";
        linkList = [
            { title: "All", link: "/admin-dashboard/courses" },
            { title: "Active", link: "/admin-dashboard/courses/active" },
            { title: "Upcoming", link: "/admin-dashboard/courses/upcoming" },
            { title: "Completed", link: "/admin-dashboard/courses/completed" },
        ];
    }
    else if (currentPath.includes("/admin-dashboard/courses/detail")) {
        PageTitle = "Course";
        linkList= [];
    }
    else if (currentPath.includes("/admin-dashboard/cohort")) {
        PageTitle = "Cohort";
        linkList= [];
    }
    else if (currentPath === "/admin-dashboard/classes") {
        PageTitle = "Classes";
        linkList= [];
    }
    else if (currentPath.includes("/admin-dashboard/classes")) {
        PageTitle = "Class";
        linkList= [];
    }
    else if (currentPath === "/admin-dashboard/tasks") {
        PageTitle = "Tasks";
        linkList= [];
    }
    else if (currentPath === "/admin-dashboard/teacher") {
        PageTitle = "Teacher";
        linkList= [];
    }
    else if (
        currentPath === "/admin-dashboard/student" ||
        currentPath === "/admin-dashboard/student/" ||
        currentPath === "/admin-dashboard/student/pending"
    ) {
        PageTitle = "Student";
        linkList = [
            { title: "All", link: "/admin-dashboard/student" },
            { title: "Pending", link: "/admin-dashboard/student/pending" },
        ];
    }
    else if (currentPath === "/admin-dashboard/roles") {
        PageTitle = "Roles";
        linkList= [];
    }
    else if (currentPath === "/admin-dashboard/activitylog") {
        PageTitle = "Activity Log";
        linkList= [];
    }
    else if (currentPath === "/admin-dashboard/profile") {
        PageTitle = "Profile";
        linkList= [];
    }


    const toProfilePage = () => {
        window.location.href = "/admin-dashboard/profile";
    }
    

    return (
        <div className={styles.header}>

            <div className={styles.headerLeft}>
                <h3>{PageTitle}</h3>
                <div className={styles.links}>
                    {linkList.map(({ title, link }, index) => (
                        <a key={index} href={link} className={currentPath === link ? styles.activeLink : styles.inactiveLink}>
                            {title}
                        </a>
                    ))}
                </div>
            </div>

            <div className={styles.headerRight}>

                <div className={styles.searchBar}>
                    <img src={getImageUrl('searchIcon.png')} />
                    <input type="text" placeholder="Search" />
                </div>
                <div className={styles.buttons}>
                    <button><img src={getImageUrl('bell.png')} /></button>
                    <button><img src={getImageUrl('settings.png')} /></button>
                    <button onClick={toProfilePage} className={styles.profile}><img src={getImageUrl('profile.svg')} /></button>
                </div>
            </div>
        </div>
        
    )
}