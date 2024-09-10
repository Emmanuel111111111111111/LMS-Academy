import React, { useState } from "react";

import { getImageUrl } from "../../../utilis";
import styles from "./Login.module.css";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export const AdminLogin = () => {

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ errorMessage, setErrorMesage ] = useState(false);
  const navigate = useNavigate();

 

  function handleSubmit(event) {
    event.preventDefault();
    navigate('/admin-dashboard')
    // axios.post('http://localhost:8081/adminlogin', {email, password})
    //   .then(res => {
    //     console.log(res)
    //     if (res.data === "No records") setErrorMesage(true);
    //     else if (res.data === "Login Successfully") navigate('/dashboard');
    //   })
    //   .catch(err => console.log(err));   
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.big}>
      
      <div className={styles.bread}>
        <img src={getImageUrl("Frame 349.png")} alt="" />
        <h3>The ultimate financial management solution. Seize control,gain insightful data.</h3>
      </div>

      <div className={styles.crumb}>
        <div className={styles.pan}>
          <a href="/CWG"><img src={getImageUrl("arrow.png")} alt="" /></a>
          <h5><span>Back to</span> Home</h5>
        </div>
        <div className={styles.crumbs}>
          <h1>Log in to your account</h1>
          <p>Lets help you get started on CWG Academy</p>
        </div>
        <div className={styles.forms}>
          <form onSubmit={handleSubmit}>
            {errorMessage && <p style={{color: 'red'}}>Wrong username or password. Try again</p>}
            <div className={styles.formgroup}>
              <label for="name">Phone Number or Email Address</label>
              <input placeholder="Enter your phone number or email address" name="email" onChange={e => setEmail(e.target.value)} />
            </div>
            <div className={styles.formgroup}>
              <label for="Password">Password</label>
              <div className={styles.password}>

                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" name="password" onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword((showPassword) => !showPassword)}><img src={getImageUrl("off.png")} alt="y" /></button>

              </div>
            </div>
            <p>Forgot password?<a href="/Reset"> <span>Reset Password</span> </a></p>

            <div className={styles.home}>
              <button className={styles.butt} type="submit">Log In</button>
              <p>Don't Have An Account? <a href="/Account">Create An Account</a></p>
            </div>
          </form>
        </div>

      </div>

    </div>
  )
}