import React, { useEffect, useRef, useState } from "react";
import styles from './ProfilePage.module.css';
import { getImageUrl } from "../../utilis";
import { BASE_URL, TEST_URL } from "../../../config";
import axios from 'axios';
import { customToast } from "../../Components/Notifications";



export const ProfilePage = () => {

    const [ email, setEmail ] = useState("");
    const [ type, setType ] = useState("");
    const [ userInfo, setUserInfo ] = useState({});
    const [ newInfo, setNewInfo ] = useState({});

    useEffect(() => {
        getUserInfo();
        setType(sessionStorage.getItem("type")!= 'null' ? sessionStorage.getItem("type"):"");
    }, []);


    const getUserInfo = async () => {
        try {
            if (sessionStorage.getItem("type") === 'student') {
                const response = await axios.get(TEST_URL + `/student-profile/${sessionStorage.getItem("id")}`)
                setUserInfo(response.data[0]);
                setNewInfo({
                    first_name: response.data[0].first_name,
                    last_name: response.data[0].last_name,
                    email: response.data[0].email,
                });
            }

            if (sessionStorage.getItem("type") === 'teacher') {
                const response = await axios.get(TEST_URL + `/teacher-profile/${sessionStorage.getItem("id")}`)
                setUserInfo(response.data[0]);
                setNewInfo({
                    first_name: response.data[0].first_name,
                    last_name: response.data[0].last_name,
                    email: response.data[0].email,
                    role: response.data[0].role,
                    description: response.data[0].description,
                });
            }
        } catch (error) {
            console.error('Error getting your information:', error);
            customToast('Error getting your information.');
        }
    }
    
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(newInfo)
        
        try {

            if (type === 'student') {
                const response = await fetch(BASE_URL + `/student-profile/${sessionStorage.getItem("id")}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newInfo),
                });
    
                if (response.ok) {
                    customToast('Your information was updated successfully')
                } else {
                    console.error("Failed to update info");
                }
            }

            if (type === 'teacher') {
                const response = await fetch(TEST_URL + `/teacher-profile/${sessionStorage.getItem("id")}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newInfo),
                });
    
                if (response.ok) {
                    customToast('Your information was updated successfully')
                } else {
                    console.error("Failed to update info");
                }
            }

            getUserInfo();
        } catch (error) {
            console.log('Error updating info:', error);
            customToast("There was an error while updating your information. Please try again.")
        }
    };



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
                            <input type="text" name="first_name" value={newInfo.first_name} onChange={handleInputChange} />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="">Last Name</label>
                            <input type="text" name="last_name" value={newInfo.last_name} onChange={handleInputChange} />
                        </div>
                    </div>

                    <div className={styles.formFlex}>
                        <div className={styles.formGroup}>
                            <label htmlFor="">Email</label>
                            <input type="text" name="email" value={newInfo.email} disabled />
                        </div>

                        {type === 'teacher' ?
                            <div className={styles.formGroup}>
                                <label htmlFor="">Role</label>
                                <input type="text" name="role" value={newInfo.role} onChange={handleInputChange} />
                            </div>
                        :
                            <div className={styles.formGroup}></div>
                        }
                    </div>

                    {type === 'teacher' &&
                        <div className={styles.formGroup}>
                            <label htmlFor="">Description</label>
                            <textarea type="text" name="description" value={newInfo.description} onChange={handleInputChange} />
                        </div>
                    }


                    <div className={styles.buttons}>
                        <button className={styles.buttonOne} type="submit" onClick={handleSubmit}>Save</button>
                        <button className={styles.buttonTwo} type="button" onClick={"handleReset"}>Reset</button>
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