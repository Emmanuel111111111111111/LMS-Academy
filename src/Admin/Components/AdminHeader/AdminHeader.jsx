import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../../utilis";


export const AdminHeader = () => {

    const navigate = useNavigate();

    let currentPath = window.location.pathname;
    let PageTitle;
    let linkList = [];

    switch (currentPath) {

        case "/":
        case "/admin-dashboard":
        case "/admin-dashboard/overview":
            PageTitle = "Home";
            break;
        
        case "/admin-dashboard/schedule":
            PageTitle = "Schedule";
            break;
        
        case "/admin-dashboard/courses":
        case "/admin-dashboard/courses/active":
        case "/admin-dashboard/courses/completed":
            PageTitle = "Courses";
            linkList = [
                {title: "Active", link: "/dashboard/courses/active"},
                {title: "Completed", link: "/dashboard/coures/completed"}
            ];
            break;
        
        case "/admin-dashboard/tasks":
            PageTitle = "Tasks";
            break;
        
        case "/admin-dashboard/teacher":
            PageTitle = "Teacher";
            break;
        
        case "/admin-dashboard/student":
            PageTitle = "Student";
            break;

        case "/admin-dashboard/activitylog":
            PageTitle = "Activity Log";
            break;
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
                    <button className={styles.profile}><img src={getImageUrl('avatar.png')} /></button>
                </div>
            </div>
        </div>
        
    )
}