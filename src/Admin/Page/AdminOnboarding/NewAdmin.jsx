import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./AdminOnboarding.module.css";
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";
import { useParams } from "react-router-dom";



export const NewAdmin = () => {

  const { id } = useParams();

  const [ teacher, setTeacher ] = useState({});
  const [ password, setPassword ] = useState('');
  const [ errorMessage, setErrorMesage ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    getInstructor();
  }, [])

  const getInstructor = async () => {
    setIsLoading(true);
    try {
      const result = await axios(BASE_URL + `/teachers/${id}`,
        {
          timeout: 30000,
        }
      );
      if (result.data[0] === undefined || result.data[0] === null) {
          window.location.href = "/CWG";
      } else {
          setTeacher(result.data[0]);
          setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(BASE_URL + '/admin-signup', { password, id });
      console.log(response.status)
      setIsLoading(false);
      window.location.href = "/admin-login";
    } catch (err) {
      setIsLoading(false);
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

        <div className={styles.crumbs}>
          <h1>Welcome to LMS</h1>
          <p>Let's help you get started on CWG Academy</p>
        </div>

          <form className={styles.form} onSubmit={handleSubmit}>

            {errorMessage && <p style={{ color: 'red' }}>Wrong username or password. Try again</p>}

            <div className={styles.formgroup}>
              <label for="name">Email Address</label>
              <input value={isLoading ? '...' : teacher.email} name="email" disabled />
            </div>

            <div className={styles.formgroup}>
              <label for="Password">Set Your Password</label>
              <div className={styles.password}>

                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" name="password" onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword((showPassword) => !showPassword)}><img src={getImageUrl("visibility_off.png")} alt="y" /></button>

              </div>
            </div>

            <button className={styles.butt}>{isLoading ? '...' : 'Set Up'}</button>

          </form>

      </div>

    </div>
  )
}