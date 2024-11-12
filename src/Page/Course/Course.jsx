import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./Course.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../config";

export const Course = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [ courses, setCourses ] = useState([]);
    const [ studentId, setStudentId ] = useState("0");
    const [ isLoading, setIsLoading ] = useState(false);


    useEffect(() => {
       console.log(sessionStorage);
       setStudentId(sessionStorage.getItem("id"));
    }, []);

    useEffect(() => {
        fetchCoursesTeachersStudents();
    }, []);

    const fetchCoursesTeachersStudents = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/courses-instructor-students");
            setCourses(result.data.filter(e => e.students.some(student => String(student.id) === studentId)));
            console.log(result.data.filter(e => e.students.some(student => String(student.id) === studentId)));
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setErrorMessage(true);
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
                                        <div><h3>{cour.name}<span>{cour.type}</span></h3></div>
                                        <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                                    </div>
                                    <p>{cour.description}</p>
                                    <div className={styles.courseData}>
                                        <div className={styles.bread}>
                                            <div className={styles.profile}><img src={getImageUrl('profile.svg')} alt="" />{cour.instructors[0].name}</div>
                                            <div className={styles.students}><img src={getImageUrl('pic.png')} alt="" />{cour.students.length} {cour.students.length === 1 ? 'Student' : 'Students'}</div>
                                        </div>
                                        <div className={styles.crumb}>
                                            <div className={styles.profile}><img src={getImageUrl('timer.png')} alt="" />{cour.duration}</div>
                                            <div className={styles.profile}><img src={getImageUrl('instructors.png')} alt="" />{cour.totalLessons} Modules</div>
                                            <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />10am Wed-Fri</div>
                                        </div>
                                    </div>
                                    <div className={styles.withLoader}>
                                        <div className={styles.coursesLoader}>
                                            <p>{cour.currentLesson}/{cour.totalLessons} Modules</p>
                                            <progress className={styles.progress} id="progress" max={cour.totalLessons} value={cour.currentLesson} />
                                        </div>
                                        <button>Continue Course</button>
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