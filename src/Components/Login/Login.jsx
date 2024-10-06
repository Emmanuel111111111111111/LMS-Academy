import React, { useEffect, useState } from "react";

import { getImageUrl } from "../../utilis";
import styles from "./Login.module.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


export const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const [errorMessage, setErrorMesage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // sessionStorage.clear();
  }, [])

 

  function handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:8081/login', { email, password })
      .then(res => {
        console.log(res)
        if (res.data === "No records") setErrorMesage(true);
        else if (res.data.length === 1) {
          console.log("signed in");
          sessionStorage.setItem("id", res.data[0].student_id);
          sessionStorage.setItem("first_name", res.data[0].first_name);
          sessionStorage.setItem("last_name", res.data[0].last_name);
          sessionStorage.setItem("email", res.data[0].email);
          console.log(res.data[0].first_name);

          navigate('/dashboard');
        }
      })
      .catch(err => console.log(err));
  }

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.big}>

      <div className={styles.bread}>
        <img src={getImageUrl("Frame 349.png")} alt="" />
        <h3>The ultimate financial management solution. Seize control, gain insightful data.</h3>
      </div>

      <div className={styles.crumb}>

        <a href="/CWG" className={styles.pan}>
          <img src={getImageUrl("arrow.png")} alt="" />
          Back to <p>Home</p>
        </a>

        <div className={styles.crumbs}>
          <h1>Log in to your account</h1>
          <p>Lets help you get started on CWG Academy</p>
        </div>

          <form className={styles.form} onSubmit={handleSubmit}>

            {errorMessage && <p style={{ color: 'red' }}>Wrong username or password. Try again</p>}

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

            <p>Forgot password? <a href="/Reset">Reset Password</a></p>

            <div className={styles.home}>
              <button className={styles.butt} type="submit" onClick={()=>navigate('/dashboard')}>Log In</button>
              <p>Don't Have An Account? <a href="/Account">Create An Account</a></p>
            </div>

          </form>

      </div>

    </div>
  )
}