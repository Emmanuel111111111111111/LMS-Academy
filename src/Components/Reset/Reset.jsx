import React, { useState } from "react";

import { getImageUrl } from "../../utilis";
import styles from "./Reset.module.css";


export const Reset = () => {
  return (
    <div className={styles.big}>
      <div className={styles.bread}>
        <img src={getImageUrl("Frame 349.png")} alt="" />
        <h3>The ultimate financial management solution. Seize control,gain insightful data.</h3>
      </div>
      <div className={styles.crumb}>

        <a href="/Login" className={styles.pan}>
          <img src={getImageUrl("arrow.png")} alt="" />
          Back to<span> login</span>
        </a>

        <div className={styles.crumbs}>
          <h1>Reset Your Password</h1>
          <p>Lets help you get started on CWG Academy</p>
        </div>

        <form className={styles.form}>
          <div className={styles.formgroup}>
            <label for="name">Phone Number or Email Address</label>
            <input placeholder="Enter your phone number or email address" name="ID" />
          </div>

          <button className={styles.butt}>Send Reset Mail</button>

        </form>

      </div>

    </div >
  )
}