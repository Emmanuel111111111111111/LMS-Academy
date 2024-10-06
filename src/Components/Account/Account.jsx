import React, { useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./Account.module.css";
import { useNavigate } from "react-router-dom";


export const Account = () => {

    const navigate = useNavigate();

    const [values, setValues] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        learning_mode: '',
        password: ''
    })

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        navigate('/Password', {state: values });
    }

    return (
        <div className={styles.big}>

            <div className={styles.bread}>
                <img src={getImageUrl("Frame 349.png")} alt="" />
                <h3>The ultimate financial management solution.Seize control,gain insightful data.</h3>
            </div>

            <div className={styles.crumb}>

                <a href="/CWG" className={styles.pan}>
                    <img src={getImageUrl("arrow.png")} alt="" />
                    Back to <span>Home</span>
                </a>

                <div className={styles.crumbs}>
                    <h1>Create your account</h1>
                    <p>Lets help you get started on CWG Academy</p>
                </div>
                
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.name}>
                        <div className={styles.formgroup}>
                            <label htmlFor="first_name">First Name</label>
                            <input placeholder="Enter your first name" name="first_name" onChange={handleInput} />
                        </div>
                        <div className={styles.formgroup}>
                            <label htmlFor="last_name">Last Name</label>
                            <input placeholder="Enter your last name" name="last_name" onChange={handleInput} />
                        </div>
                    </div>
                    <div className={styles.formgroup}>
                        <label htmlFor="phone_number">Phone Number</label>
                        <input placeholder="Enter your phone number" name="phone_number" onChange={handleInput} />
                    </div>
                    <div className={styles.formgroup}>
                        <label htmlFor="email">Email address</label>
                        <input placeholder="Enter your email address" name="email" onChange={handleInput} />
                    </div>
                    <div className={styles.formgroup}>
                        <label htmlFor="learning_mode">Preferred Mode of learning</label>
                        <select name="learning_mode" onChange={handleInput} >
                            <option value="">Select your preferred learning mode</option>
                            <option value="online">Online</option>
                            <option value="physical">Physical</option>
                        </select>
                    </div>

                        <div className={styles.check}>
                            <input type="checkbox" name="agree" required />
                            <p>I agree to CWG'S <span>Terms of Use</span> and consent to CWG's <span>Privacy policy</span></p>
                        </div>
                        <div className={styles.check}>
                            <input type="checkbox" name="subscribe" />
                            <p>Receive marketing emails and communications about our products.</p>
                        </div>

                    <div className={styles.home}>
                        <button className={styles.butt}>Next</button>
                        <p>Already have An Account? <a href="/Login">Sign In</a></p>
                    </div>
                </form>

            </div>
        </div>

    )
}