import React, { useState } from "react";

import { getImageUrl } from "../../utilis";
import styles from "./Reset.module.css";


export const Reset = () => {
    return(
        <div className={styles.big}>
        <div className={styles.bread}>
        <img src={getImageUrl("Frame 349.png")} alt="" />
            <h3>The ultimate financial management solution. Seize control,gain insightful data.</h3>
        </div>
        <div className={styles.crumb}>
           <div className={styles.pan}>
            <a href="/Login"><h5><span>Back</span> to login</h5></a>
           </div>
          <div className={styles.crumbs}>
            <h1>Reset Your Password</h1>
            <p>Lets help you get started on CWG Academy</p>
          </div>
         <div className={styles.forms}>
          <form>
            <div className={styles.formgroup}>
                 <label for="name">Phone Number or Email Address</label>
                <input placeholder="Enter your phone number or email address" name="ID" />
            </div>
            
            
          </form>
         </div>
         <div className={styles.home}>
           <button className={styles.butt}>Send Reset Mail</button>
           
           </div>
        </div>

    </div>
    )
}