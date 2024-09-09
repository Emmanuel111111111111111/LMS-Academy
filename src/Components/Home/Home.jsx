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
                 <li className={styles.folding}>
                    <img src={getImageUrl("Comp2.png")} alt="h" />
                     <a className={styles.link} href="/home">Home</a>
                    </li>
                    <li className={styles.folding}>
                        <img src={getImageUrl("Comp3.png")} alt="ffff" />
                     <a className={styles.link} href="/courses">Courses</a>
                    </li>
                    <li className={styles.folding}>
                        <img src={getImageUrl("Comp4.png")} alt="" />
                     <a className={styles.link} href="/calender">Calendar</a>
                    </li>
                    <li className={styles.folding}>
                        <img src={getImageUrl("Comp5.png")} alt="" />
                     <a className={styles.link} href="/certificate">Certificate</a>
                    </li>
                    <li className={styles.Logout}>
                        <img src={getImageUrl("Group.png")} alt="" />
                     <a className={styles.link} href="/logout">Logout</a>
                    </li>

                 </ul>
                 
            </div>
             <div className={styles.crumb}>
                <div>
                    <h4>Home</h4>
                    <form>
                        <div>
                          <input placeholder="Search" name="Topic"  />
                        </div>
                    </form>
                    <img src={getImageUrl("comp14.png")} alt="" />

                </div>
             </div>


        </div>
    )
}