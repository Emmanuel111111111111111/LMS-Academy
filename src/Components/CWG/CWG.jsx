import React from "react";

import { getImageUrl } from "../../utilis";
import styles from "./CWG.module.css";

export const CWG = () => {
    return(
        <div className={styles.bread}>
            <div className={styles.crumb}>
                <img src={getImageUrl("Frame 349.png")} alt="" />
                <a href="/Login"><button>Get Started</button></a>
            </div>
        </div>
    )
}