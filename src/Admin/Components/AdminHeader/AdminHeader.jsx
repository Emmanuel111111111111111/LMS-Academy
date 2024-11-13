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
        currentPath === "/admin-dashboard/overview"
    ) {
        PageTitle = "Home";
    }
    else if (currentPath === "/admin-dashboard/schedule") {
        PageTitle = "Schedule";
    }
    else if (
        currentPath === "/admin-dashboard/courses" ||
        currentPath === "/admin-dashboard/courses/active" ||
        currentPath === "/admin-dashboard/courses/upcoming" ||
        currentPath === "/admin-dashboard/courses/completed"
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
        PageTitle = "Courses";
    }
    else if (currentPath.includes("/admin-dashboard/cohort")) {
        PageTitle = "Cohort";
    }
    else if (currentPath === "/admin-dashboard/classes") {
        PageTitle = "Classes";
    }
    else if (currentPath.includes("/admin-dashboard/clsses/detail")) {
        PageTitle = "Class";
    }
    else if (currentPath === "/admin-dashboard/tasks") {
        PageTitle = "Tasks";
    }
    else if (currentPath === "/admin-dashboard/teacher") {
        PageTitle = "Teacher";
    }
    else if (
        currentPath === "/admin-dashboard/student" ||
        currentPath === "/admin-dashboard/student/pending"
    ) {
        PageTitle = "Student";
        linkList = [
            { title: "All", link: "/admin-dashboard/student" },
            { title: "Pending", link: "/admin-dashboard/student/pending" },
        ];
    }
    else if (currentPath === "/admin-dashboard/activitylog") {
        PageTitle = "Activity Log";
    }
    else if (currentPath === "/admin-dashboard/profile") {
        PageTitle = "Profile";
    }
    



    // switch (currentPath) {

    //     case "/":
    //     case "/admin-dashboard":
    //     case "/admin-dashboard/overview":
    //         PageTitle = "Home";
    //         break;
        
    //     case "/admin-dashboard/schedule":
    //         PageTitle = "Schedule";
    //         break;
        
    //     case "/admin-dashboard/courses":
    //     case "/admin-dashboard/courses/active":
    //     case "/admin-dashboard/courses/upcoming":
    //     case "/admin-dashboard/courses/completed":
    //         PageTitle = "Courses";
    //         linkList = [
    //             {title: "All", link: "/admin-dashboard/courses"},
    //             {title: "Active", link: "/admin-dashboard/courses/active"},
    //             {title: "Upcoming", link: "/admin-dashboard/courses/upcoming"},
    //             {title: "Completed", link: "/admin-dashboard/courses/completed"},
    //         ];
    //         break;
    //     case "/admin-dashboard/courses/detail":
    //         PageTitle = "Courses";
    //         break;
        
    //     // if (currentPath.includes("/admin-dashboard/cohort"))
    //     case "/admin-dashboard/cohort":
    //     case "/admin-dashboard/cohort/:id":
    //         PageTitle = "Cohort";
    //         break;

    //     case "/admin-dashboard/class":
    //         PageTitle = "Class";
    //         break;
        
    //     case "/admin-dashboard/tasks":
    //         PageTitle = "Tasks";
    //         break;
        
    //     case "/admin-dashboard/teacher":
    //         PageTitle = "Teacher";
    //         break;
        
    //     case "/admin-dashboard/student":
    //     case "/admin-dashboard/student/pending":
    //         PageTitle = "Student";
    //         linkList = [
    //             {title: "All", link: "/admin-dashboard/student"},
    //             {title: "Pending", link: "/admin-dashboard/student/pending"}
    //         ];
    //         break;

    //     case "/admin-dashboard/activitylog":
    //         PageTitle = "Activity Log";
    //         break;

    //     case "/admin-dashboard/profile":
    //         PageTitle = "Profile";
    //         break;
    // }

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
                    <button className={styles.profile}><img src={getImageUrl('profile.svg')} /></button>
                </div>
            </div>
        </div>
        
    )
}