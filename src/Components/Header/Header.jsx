import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utilis";


export const Header = () => {

    const navigate = useNavigate();

    let currentPath = window.location.pathname;
    let PageTitle;
    let linkList = [];

    switch (currentPath) {

        case "/":
        case "/dashboard":
        case "/dashboard/overview":
            PageTitle = "Home";
            break;
        
        case "/dashboard/courses":
        case "/dashboard/courses/active":
        case "/dashboard/courses/completed":
            PageTitle = "Courses";
            linkList = [
                {title: "Active", link: "/dashboard/courses/active"},
                {title: "Completed", link: "/dashboard/coures/completed"}
            ];
            break;
        
        case "/dashboard/calendar":
            PageTitle = "Calendar";
            break;
        
        case "/dashboard/certificate":
            PageTitle = "Certificate";
            break;
        
        case "/dashboard/settings":
            PageTitle = "Settings";
            break;
    }

    return (
        <div className={styles.header}>

            <div className={styles.headerLeft}>
                <img src={getImageUrl('menu.png')} />
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