import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utilis";


export const Header = () => {

    const navigate = useNavigate();

    let currentPath = window.location.pathname;
    let PageTitle;
    let linkList = [];

    if (
        currentPath === "/" ||
        currentPath === "/dashboard" ||
        currentPath === "/dashboard/overview"
    ) {
        PageTitle = "Home";
    }
    else if (
        currentPath === "/dashboard/courses" ||
        currentPath === "/dashboard/courses/active" ||
        currentPath === "/dashboard/courses/completed"
    ) {
        PageTitle = "Courses";
        linkList = [
            {title: "Active", link: "/dashboard/courses/active"},
            {title: "Completed", link: "/dashboard/courses/completed"}
        ];
    }
    else if (currentPath.includes("/dashboard/courses/detail")) {
        PageTitle = "Courses";
    }
    else if (currentPath === "/dashboard/calendar") {
        PageTitle = "Calendar";
    }
    else if (currentPath === "/dashboard/certificate") {
        PageTitle = "Certificates";
    }
    else if (currentPath === "/dashboard/settings") {
        PageTitle = "Settings";
    }
    else if (
        currentPath === "/dashboard/profile" ||
        currentPath.includes("/dashboard/profile")
    ) {
        PageTitle = "Profile";
    }

    const toProfilePage = () => {
        window.location.href = "/dashboard/profile";
    }
    const toSettingsPage = () => {
        window.location.href = "/dashboard/settings";
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
                    <button onClick={toSettingsPage}><img src={getImageUrl('settings.png')} /></button>
                    <button className={styles.profile} onClick={toProfilePage}><img src={getImageUrl('profile.svg')} /></button>
                </div>
            </div>
        </div>
        
    )
}