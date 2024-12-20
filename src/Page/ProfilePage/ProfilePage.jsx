import React, { useEffect, useRef, useState } from "react";
import styles from './ProfilePage.module.css';
import { getImageUrl } from "../../utilis";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';


export const ProfilePage = () => {

    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ email, setEmail ] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setFirstName(sessionStorage.getItem("first_name"));
        setLastName(sessionStorage.getItem("last_name"));
        setEmail(sessionStorage.getItem("email"));
    }, []);



    return (
        <>
        <div className={styles.whole}>

            <div className={styles.breadcrumb}>Profile</div>

            <div className={styles.whiteDiv}>
                <div className={styles.changePic}>
                    <img src={getImageUrl('profile.svg')} alt="" />
                    <div>
                        <button>Change Photo</button>
                        <p>Maximum size: 2MB</p>
                        <p>Preferred minimum resolution: 200*200</p>
                    </div>
                </div>

                <form action="" className={styles.profileForm}>
                    <div className={styles.formFlex}>
                        <div className={styles.formGroup}>
                            <label htmlFor="">First Name</label>
                            <input type="text" value={firstName} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="">Last Name</label>
                            <input type="text" value={lastName} />
                        </div>
                    </div>

                    <div className={styles.formFlex}>
                        <div className={styles.formGroup}>
                            <label htmlFor="">Email</label>
                            <input type="text" value={email} />
                        </div>

                        <div className={styles.formGroup}>
                        </div>
                    </div>


                    <div className={styles.buttons}>
                        <button className={styles.buttonOne}>Save</button>
                        <button className={styles.buttonTwo}>Reset</button>
                    </div>
                    
                </form>
            </div>


            <div className={styles.whiteDiv}>

                <h5>Delete Account</h5>
                <h6>Deleting the account will erase all of your information and course enrollments.</h6>

                <div className={styles.caution}>
                    <img src={getImageUrl('caution.svg')} />
                    This academy has restricted you from deleting your account.
                    Please contact the academy admin to delete your account.
                </div>

                <button className={styles.delete} disabled>Delete Account</button>

            </div>
        </div>
        </>
    )
}