import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./Certificate.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { customToast } from "../../Components/Notifications";
import { BASE_URL, TEST_URL } from "../../../config";

export const Certificate = () => {

    const [ certificates, setCertificates ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ currentPage, setCurrentPage ] = useState(1);


    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/certificates/${sessionStorage.getItem("id")}`, {
                timeout: 25000
            });
            setCertificates(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            customToast("We're having trouble fetching your certificates. Please try again later.")
            setIsLoading(false);
        }
    }


    function convertDuration(interval) {
        const result = { hours: 0, days: 0, months: 0 };

        if (interval === null) {
            return result;
        }
        else {
            result.months = interval.months || 0;
            result.weeks = interval.weeks || 0;
            result.days = interval.days || 0;
            result.hours = interval.hours || 0;
        
            return result;
        }
    }


    return (
        <div className={styles.whole}>

            <div className={styles.breadcrumb}>Certificates</div>

            <div>
                <div className={styles.title}>
                    <h1>All Certificates</h1>
                    <button>Sort By<img src={getImageUrl('sortIcon.png')} alt="" /></button>
                </div>

                <div className={styles.course}>

                    {certificates.map((certif, index) => (
                        <div className={styles.courseInfo}>
                            <div className={styles.courseImage}>
                                <img src={getImageUrl("frame11.png")} alt="h" />
                            </div>
                            <div className={styles.certInfo}>
                                <div className={styles.infoHeader}>
                                    <h3>{certif.course_name}{certif.type && <span>{certif.type}</span>}</h3>
                                    <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                                </div>
                                <p>{certif.course_description}</p>
                                <div className={styles.courseData}>
                                    <div className={styles.bread}>
                                        <div className={styles.profile}><img src={getImageUrl('profile.svg')} alt="" />{certif.instructors.map((inst, i) => (
                                            i != certif.instructors.length -1 ? inst.full_name+', ' : inst.full_name
                                        ))}</div>
                                    </div>
                                    <div className={styles.crumb}>
                                        <div className={styles.profile}><img src={getImageUrl('instructors.png')} alt="" />{certif.lessons.length} Lessons</div>
                                        <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />{} Assignments</div>
                                        {certif.duration != null && <div className={styles.profile}>
                                            <img src={getImageUrl('timer.png')} />
                                            {convertDuration(certif.duration).months === 0 ? '' : convertDuration(certif.duration).months + ' months '}
                                            {convertDuration(certif.duration).days === 0 ? '' : convertDuration(certif.duration).days + ' days '}
                                            {convertDuration(certif.duration).hours === 0 ? '' : convertDuration(certif.duration).hours + ' hours '}
                                        </div>}
                                    </div>
                                </div>
                                <div className={styles.withLoader}>
                                    <div className={styles.coursesLoader}>
                                        <p>{certif.lessons.filter(e => e.completed).length}/{certif.lessons.length}</p>
                                        <progress className={styles.progress} id="progress" max={certif.lessons.length} value={certif.lessons.filter(e => e.completed).length} />
                                    </div>
                                    <div className={styles.buttons}>
                                        <button className={styles.buttonOne}>View Certificate</button>
                                        <button className={styles.buttonTwo}>
                                            <img src={getImageUrl('blueDownload.png')} alt="" />
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    )
}