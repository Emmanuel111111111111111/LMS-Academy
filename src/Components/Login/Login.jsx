import React, { useState } from "react";

import { getImageUrl } from "../../utilis";
import styles from "./Login.module.css";
import axios from 'axios'


export const Login = () => {

  const [ values, setValues ] = useState({
    email: '',
    phone_number: '',
    password: ''
  })

  console.log(values)

  const handleInput = (event) => {
    setValues(prev => ({...prev, [event.target.name] : [event.target.value]}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/login', values)
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }

  const [ showPassword, setShowPassword ] = useState(false);

    return(
        <div className={styles.big}>
            <div className={styles.bread}>
            <img src={getImageUrl("Frame 349.png")} alt="" />
                <h3>The ultimate financial management solution. Seize control,gain insightful data.</h3>
            </div>
              <div className={styles.crumb}>
                <div className={styles.pan}>
                      <a href="/CWG"> <img src={getImageUrl("arrow.png")} alt="" /></a>
                      <h5><span>Back to</span> Home</h5>
                </div>
              <div className={styles.crumbs}>
                <h1>Log in to your account</h1>
                <p>Lets help you get started on CWG Academy</p>
              </div>
             <div className={styles.forms}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formgroup}>
                     <label for="name">Phone Number or Email Address</label>
                    <input placeholder="Enter your phone number or email address" name="email" onChange={handleInput} />
                </div>
                <div className={styles.formgroup}>
                    <label for="Password">Password</label>
                    <div className={styles.password}>
                      
                      <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" name="password" onChange={handleInput} />
                      <button type="button" onClick={() => setShowPassword((showPassword) => !showPassword)}><img src={getImageUrl("off.png")} alt="y" /></button>

                    </div>
                </div>
                <p>Forgot password?<a href="/Reset"> <span>Reset Password</span> </a></p>

                <div className={styles.home}>
                  <a href="/Home"><button className={styles.butt} type="submit">Log In</button></a>
                  <p>Don't Have An Account? <a href="/Account">Create An Account</a></p>
                </div>
              </form>
             </div>
             
            </div>

        </div>
    )
}