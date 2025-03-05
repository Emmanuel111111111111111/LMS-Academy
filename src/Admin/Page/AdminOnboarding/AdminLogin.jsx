import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./AdminOnboarding.module.css";
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";
import { customToast, customToastError } from "../../../Components/Notifications";


export const AdminLogin = () => {

  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ errorMessage, setErrorMesage ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    sessionStorage.clear();
  }, [])

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(BASE_URL + '/adminlogin',
        { email, password },
        {timeout: 10000}
      );
      
      setIsLoading(false);
      console.log(response.status);
      sessionStorage.setItem("id", response.data.instructor_id);
      sessionStorage.setItem("first_name", response.data.first_name);
      sessionStorage.setItem("last_name", response.data.last_name);
      sessionStorage.setItem("email", response.data.email);
      sessionStorage.setItem("full_name", response.data.first_name + (response.data.last_name != null ? ' ' + response.data.last_name : ''));
      sessionStorage.setItem("type", 'teacher');
      sessionStorage.setItem("role", response.data.role);
      sessionStorage.setItem("last_logged", new Date());
      console.log(response.data.first_name);
      window.location.href = "/admin-dashboard";
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        console.error(err.response.data.message);
        if (err.response.data.message === 'No records') {
          setErrorMesage(true);
          customToastError("Invalid username or password. Please try again.")
        }
        else if (err.response.data.message === 'Invalid password') {
          setErrorMesage(true);
          customToastError("Invalid username or password. Please try again.")
        }
      } else {
        console.error('Error', err.message);
        customToast("We're having trouble logging you in. Please try again.")
      }
    }
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
          <h1>Welcome Back</h1>
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
                <button type="button" onClick={() => setShowPassword((showPassword) => !showPassword)}><img src={getImageUrl("visibility_off.png")} alt="y" /></button>

              </div>
            </div>

            <p>Forgot password? <a href="/admin-reset">Reset Password</a></p>

            <button className={styles.butt} disabled={isLoading}>{isLoading ? 'Logging in...' : 'Log In'}</button>

          </form>

      </div>

    </div>
  )
}