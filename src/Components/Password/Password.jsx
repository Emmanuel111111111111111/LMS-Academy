import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./Password.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';


export const Password = () => {

    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();

    const [ values, setValues ] = useState(location.state);
    console.log(values);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        console.log(values);
        event.preventDefault();
        axios.post('http://localhost:8081/signup', values)
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    return (
        <div className={styles.big}>
            <div className={styles.bread}>
                <img src={getImageUrl("Frame 349.png")} alt="" />
                <h3>The ultimate financial management solution. Seize control,gain insightful data.</h3>
            </div>
            <div className={styles.crumb}>
                <div className={styles.pan}>
                    <a href="/CWG"><h5><span>Back</span> to Home</h5></a>
                </div>
                <div className={styles.crumbs}>
                    <h1>Create your password</h1>
                    <p>Lets help you get started on CWG Academy</p>
                </div>
                <div className={styles.forms}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formgroup}>
                            <label for="name">Password</label>
                            <input placeholder="Create a new password" name="password" onChange={handleInput} />
                        </div>
                        <div className={styles.formgroup}>
                            <label for="Re-type password">Retype your password</label>
                            <div className={styles.password}>

                                <input type={showPassword ? 'text' : 'password'} placeholder="Retype your password" name="ID" />
                                <button type="button" onClick={() => setShowPassword((showPassword) => !showPassword)}><img src={getImageUrl("Group 18.png")} alt="view" /></button>

                            </div> *
                        </div>


                    </form>
                    
                    <div className={styles.home}>
                        <a href="/Home"><button className={styles.butt}>Create My Account</button> </a>
                        </div>
                </div>

            </div>

        </div>
    )
}