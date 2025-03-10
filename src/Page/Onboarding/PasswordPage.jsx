import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./Onboarding.module.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../config";
import { customToast } from "../../Components/Notifications";


export const PasswordPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [ values, setValues ] = useState(location.state);

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(values);
        setLoading(true);
        try {
            const response = await axios.post(TEST_URL + '/signup',
                values,
                {timeout: 10000}
            );
            console.log(response.status);

            setLoading(false);
            sessionStorage.setItem("first_name", values.first_name);
            sessionStorage.setItem("email", values.email);

            customToast('We sent a confirmation email to your account. Please confirm your email address.');
            setTimeout(() => window.location.href = "/login", 5000);

        } catch (err) {
            err => console.log(err);
        }
    }

    return (
        <div className={styles.big}>

            <div className={styles.bread}>
                <img src={getImageUrl("Frame 349.png")} alt="" />
                <h3>The ultimate financial management solution. Seize control, gain insightful data.</h3>
            </div>

            <div className={styles.crumb}>

                <a href="/account" className={styles.pan}>
                    <img src={getImageUrl("arrow.png")} alt="" />
                    Back to <span>Account</span>
                </a>

                <div className={styles.crumbs}>
                    <h1>Create your password</h1>
                    <p>Lets help you get started on CWG Academy</p>
                </div>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formgroup}>
                        <label for="name">Password</label>
                        <div className={styles.password}>
                            <input type={showPassword ? 'text' : 'password'} placeholder="Create your password" name="password" onChange={handleInput} />
                            <button type="button" onClick={() => setShowPassword((showPassword) => !showPassword)}><img src={getImageUrl("visibility_off.png")} alt="view" /></button>
                        </div>
                    </div>
                    <div className={styles.formgroup}>
                        <label for="Re-type password">Retype your password</label>
                        <div className={styles.password}>
                            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Retype your password" name="ID" />
                            <button type="button" onClick={() => setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword)}><img src={getImageUrl("visibility_off.png")} alt="view" /></button>
                        </div>
                    </div>

                    <button className={styles.butt}>Create My Account</button>

                </form>

            </div>

        </div>
    )
}