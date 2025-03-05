import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./AdminOnboarding.module.css";
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";
import { useParams } from "react-router-dom";



export const SetTeacher = () => {

  const [teacher, setTeacher] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMesage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    const authToken = sessionStorage.getItem("role");
    const lastLogged = sessionStorage.getItem("last_logged");
    if ((!sessionStorage) || (!authToken) || (authToken != "Admin") || (!lastLogged) || (new Date() - new Date(lastLogged) >= 604800000)) {
      window.location.href = "/admin-login";
    }

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



  const handleInput = (event) => {
    if (event.target.value.length > 45) {
      event.target.value = event.target.value.slice(0, 45);
    }
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmitt = async (event) => {
    console.log(values);
    event.preventDefault();
    setIsLoading(true);
    try {
      const result = await axios(BASE_URL + `/getStudentWithEmail/${values.email}`);
      if (result.data.length > 0) {
        // setErrorMessage("Email already exists");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      navigate('/Password', { state: values });

    } catch (err) {
      err => console.log(err);
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


  return (
    <div className={styles.big}>

      <div className={styles.bread}>
        <img src={getImageUrl("Frame 349.png")} alt="" />
        <h3>The ultimate financial management solution. Seize control, gain insightful data.</h3>
      </div>

      <div className={styles.crumb}>

        {/* <a href="/CWG" className={styles.pan}>
          <img src={getImageUrl("arrow.png")} alt="" />
          Back to <p>Home</p>
        </a> */}

        <div className={styles.crumbs}>
          <h1>Create a new teacher account</h1>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.name}>
            <div className={styles.formgroup}>
              <label htmlFor="first_name">First Name</label>
              <input placeholder="Enter teacher's first name" name="first_name" onChange={handleInput} required />
            </div>

            <div className={styles.formgroup}>
              <label htmlFor="last_name">Last Name</label>
              <input placeholder="Enter teacher's last name" name="last_name" onChange={handleInput} />
            </div>
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="phone_number">Phone Number</label>
            <input placeholder="Enter teacher's phone number" type="number" name="phone_number" onChange={handleInput} onWheel={(e) => e.currentTarget.blur()} required />
          </div>
          <div className={styles.formgroup}>
            <label htmlFor="email">Email address</label>
            <input placeholder="Enter teacher's email address" type="email" name="email" onChange={handleInput} />
            <p style={{ color: "red" }}>{errorMessage}</p>
          </div>

          <button className={styles.butt}>{isLoading ? "..." : "Create"}</button>
          
        </form>

      </div>

    </div>
  )
}