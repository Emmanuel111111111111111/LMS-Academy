import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./Courses.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import { BASE_URL, TEST_URL } from "../../../config";

export const CompletedCourse = () => {

    const [ courses, setCourses ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);


    useEffect(() => {
        fetchCoursesTeachersStudents();
    }, []);

    const fetchCoursesTeachersStudents = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/courses-instructor-students-lessons/${sessionStorage.getItem("id")}`);
            setCourses(result.data.filter(e => e.completed === true));
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            customToast("We're having trouble fetching your courses. Please try again later.")
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
        <>
            <div className={styles.whole}>
                
                <div className={styles.breadcrumb}><a href="/dashboard/courses">Courses</a> {'>'} Active</div>
                
                <div>
                    <div className={styles.title}>
                        <h1>Active Courses <span>({courses.length})</span></h1>
                        <button>Sort By <img src={getImageUrl('sortIcon.png')} alt="" /></button>
                    </div>

                    {isLoading ? <h5 className={styles.loading}>Loading...</h5> :                    
                        <div className={styles.course}>
                            {courses.map((cour, index) => (
                                <div className={styles.courseInfo} key={index}>
                                    <div className={styles.infoHeader}>
                                        <div><h3>{cour.course_name}{cour.type && <span>{cour.type}</span>}</h3></div>
                                        <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                                    </div>
                                    <p>{cour.description}</p>
                                    <div className={styles.courseData}>
                                        <div className={styles.bread}>
                                            <div className={styles.profile}><img src={getImageUrl('profile.svg')} alt="" />{cour.instructors[0].full_name}</div>
                                            <div className={styles.students}><img src={getImageUrl('pic.png')} alt="" />{cour.students.length} {cour.students.length === 1 ? 'Student' : 'Students'}</div>
                                        </div>
                                        <div className={styles.crumb}>
                                            {cour.duration != null && <div className={styles.profile}>
                                                <img src={getImageUrl('timer.png')} />
                                                {convertDuration(cour.duration).months === 0 ? '' : convertDuration(cour.duration).months + ' months '}
                                                {convertDuration(cour.duration).days === 0 ? '' : convertDuration(cour.duration).days + ' days '}
                                                {convertDuration(cour.duration).hours === 0 ? '' : convertDuration(cour.duration).hours + ' hours '}
                                            </div>}
                                            {cour.lessons.length > 0 && <><div className={styles.profile}><img src={getImageUrl('instructors.png')} alt="" />{cour.lessons.length} Lessons</div>
                                            <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />{format(new Date(cour.lessons[0].start_date), 'ha ')}</div></>}
                                        </div>
                                    </div>
                                    <div className={styles.withLoader}>
                                        {<div className={styles.coursesLoader}>
                                            <p>{cour.lessons.filter(e => e.completed).length}/{cour.lessons.length} Lessons</p>
                                            <progress className={styles.progress} id="progress" max={cour.lessons.length} value={cour.lessons.filter(e => e.completed).length} />
                                        </div>}
                                        <button>View Certificate</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
                </div>
            </div>
        </>
    )


}