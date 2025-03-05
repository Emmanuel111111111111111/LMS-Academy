import React, { useEffect, useState } from "react";

import { getImageUrl } from "../../utilis";
import styles from "./Onboarding.module.css";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, TEST_URL } from "../../../config";
import { customToast, customToastError } from "../../Components/Notifications";


export const ConfirmationPage = () => {

  const { id } = useParams();
  
  const [ isLoading, setIsLoading ] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
    confirmUser();
  }, [])


  const confirmUser = async () => {
    setIsLoading(true);
    try {
      const result = await axios(TEST_URL + `/confirm-student/${id}`,
        {
        timeout: 20000,
        }
      );
      console.log(result)
      if (result.status != 200) {
        window.location.href = "/CWG";
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  const gotosignin = () => {
    window.location.href = "/login";
  }


  return (
    <div className={styles.big}>

      <div className={styles.bread}>
        <img src={getImageUrl("Frame 349.png")} alt="" />
        <h3>The ultimate financial management solution. Seize control, gain insightful data.</h3>
      </div>

      {
        isLoading ? <div className={styles.crumb}><p className={styles.loading}>Loading...</p></div>
        :
        <div className={styles.crumb}>
          <div className={styles.crumbs}>
            <h1>Congratulations</h1>
            <p>You have finished signing up for the academy</p>
          </div>

          <div className={styles.form}>

            <img src={getImageUrl('completed.svg')} alt="success" className={styles.success} />
            
            <button className={styles.butt} disabled={isLoading} onClick={gotosignin}>{isLoading ? '...' : 'To Sign In'}</button>

          </div>
        </div>
      }
    </div>
  )
}