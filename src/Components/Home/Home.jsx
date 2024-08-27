import React, { useState } from "react";

import { getImageUrl } from "../../utilis";
import styles from "./Home.module.css";
import axios from 'axios'


export const Home = () => {
    return(
        <div className={styles.big}>
            <div className={styles.bread}>
                <img src={getImageUrl("Frame 349.png")} alt="" />
                 <ul className={styles.links}>
                 <li>
                    <img src={getImageUrl("Comp2.png")} alt="h" />
                     <a className={styles.link} href="/home">Home</a>
                    </li>
                    <li>
                        <img src={getImageUrl("Comp3.png")} alt="ffff" />
                     <a className={styles.link} href="/courses">Courses</a>
                    </li>
                    <li>
                        <img src={getImageUrl("Comp4.png")} alt="" />
                     <a className={styles.link} href="/calender">Calendar</a>
                    </li>
                    <li>
                        <img src={getImageUrl("Comp5.png")} alt="" />
                     <a className={styles.link} href="/certificate">Certificate</a>
                    </li>

                 </ul>
                 <p>Logout</p>
            </div>
             <div className={styles.crumb}>
                <div>
                    <h4>Home</h4>
                    <img src={getImageUrl("Search.png")} alt="" />
                    <img src={getImageUrl("comp14.png")} alt="" />

                </div>
             </div>


        </div>
    )
}