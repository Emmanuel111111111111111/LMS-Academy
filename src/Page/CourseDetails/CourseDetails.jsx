import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./CourseDetails.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { customToast } from "../../Components/Notifications.jsx";
import { BASE_URL, TEST_URL } from "../../../config";


export const CourseDetails = () => {

    const navigate = useNavigate();
    const { courseID } = useParams();
    const [course, setCourse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadCourseDetails();
    }, [])

    const loadCourseDetails = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/courses-instructor-students-lessons/${sessionStorage.getItem("id")}`);
            if (result.data.filter(e => e.course_id === parseInt(courseID))[0] === undefined) {
                window.location.href = "/dashboard/courses";
                return
            }
            setCourse(result.data.filter(e => e.course_id === parseInt(courseID))[0]);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setCourse(undefined);
            customToast("We're having trouble getting details for this course. Please try again later.");
        }
    }

    const [openAccId, setOpenAccId] = useState(null);
    const toggleAccordion = (id) => {
        setOpenAccId(openAccId === id ? null : id);
    }


    const handleDownload = async (fileId) => {
        try {
            const response = await fetch(BASE_URL + `/file/${fileId}`);
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
    
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const contentDisposition = response.headers.get('Content-Disposition');
            console.log(response)
            const fileName = contentDisposition
                ? contentDisposition.split('file_name=')[1].replace(/"/g, '')
                : 'downloaded-file';
    
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };


    return (
        <>

            <div className={styles.whole}>

                <div className={styles.breadcrumb}><a href="/dashboard/courses">Courses</a> {'>'} <a href="/dashboard/courses">Active</a> {'>'} {course ? course.course_name : 'NA'}</div>

                {isLoading ? <p className={styles.loading}>Loading...</p>
                :
                    course === undefined ? <p className={styles.none}>No course information</p>
                :
                    <div className={styles.split}>

                        <div className={styles.larger}>

                            <div className={styles.courseTitle}>
                                <div>
                                    <h3>{course.course_name}</h3>
                                    <div className={styles.titleInfo}>
                                        <div className={styles.teach}>
                                            <img src={getImageUrl('profile.svg')} alt="" />
                                            {course.instructors?.map((inst, ind) => (
                                                ind != course.instructors.length - 1 ? inst.full_name + ', ' : inst.full_name
                                            ))}
                                        </div>
                                        <div className={styles.stud}>
                                            <div className={styles.stack}>
                                                {course.students?.map((img, i) =>
                                                    <img src={getImageUrl('profile.svg')} alt="" key={i} />
                                                )}
                                            </div>
                                            {course.students?.length} Registered student{course.students?.length != 1 && `s`}
                                        </div>
                                    </div>
                                    {course.type && <div className={styles.loc}>
                                        {course.type}
                                    </div>}
                                </div>
                                <button>
                                    <img src={getImageUrl('share.svg')} alt="" />
                                    Share
                                </button>
                            </div>


                            <div className={styles.courseImg} style={{
                                backgroundImage: `url(${getImageUrl('courseImg.jpeg')})`
                            }}>
                                <button>Continue Course</button>
                            </div>

                            <div className={styles.tabs}>
                                <button>Details</button>
                                <button>Instructor</button>
                                <button>Course</button>
                            </div>

                            <div className={styles.theDetails}>
                                {(course.description || course.obectives) && <div className={styles.details}>
                                    {course.description && <>
                                        <h3>Course Overview</h3>
                                        <p>{course.description}</p>
                                    </>}

                                    {course.objectives && <>
                                        <h3>Key Learning Objectives</h3>
                                        <ul>
                                            <li>Gain a clear understanding of what User Experience (UX) Design entails and its importance in today's digital world.</li>
                                            <li>Explore the fundamental principles of user-centered design and how to apply them to create intuitive and user-friendly interfaces.</li>
                                            <li>Learn about the various elements that contribute to a positive user experience, including information architecture, interaction design, and visual design.</li>
                                        </ul>
                                    </>}
                                </div>}

                                {course.instructors?.length > 0 && <>

                                    <h3>Instructor{course.instructors?.length > 1 && 's'}</h3>

                                    {course.instructors.map((inst, i) => (

                                        <div className={styles.details}>
                                            <h4>{inst.full_name}</h4>
                                            <h5>{inst.role}</h5>

                                            <div className={styles.flex}>
                                                <img className={styles.teachPic} src={getImageUrl('teach.svg')} alt="" />
                                                <div>
                                                    <div className={styles.teacherInfo}>
                                                        <img src={getImageUrl('review.svg')} alt="" />
                                                        40,445 Reviews
                                                    </div>
                                                    <div className={styles.teacherInfo}>
                                                        <img src={getImageUrl('hat.svg')} alt="" />
                                                        500 Students
                                                    </div>
                                                    <div className={styles.teacherInfo}>
                                                        <img src={getImageUrl('play.svg')} alt="" />
                                                        15 Courses
                                                    </div>
                                                </div>
                                            </div>

                                            {inst.description}

                                        </div>
                                    ))}

                                </>}
                            </div>

                        </div>



                        <div className={styles.smaller}>

                            <div className={styles.completion}>
                                <h3>Course Completion</h3>


                                <div className={styles.accordionDiv}>
                                    {course.lessons?.length < 1 ? <p className={styles.noLessons}>No lessons yet</p>
                                    :
                                    course.lessons?.map((lesson, i) => (
                                        <>
                                            <div key={lesson.id} className={styles.accordion}>
                                                <div className={styles.accHeader} onClick={() => toggleAccordion(lesson.lesson_id)}>
                                                    <span style={{
                                                        ...styles.arrow,
                                                        transform: openAccId === lesson.lesson_id ? 'rotate(180deg)' : 'rotate(0deg)'
                                                    }}>
                                                        ^
                                                    </span>
                                                    <h4>Lesson {lesson.number} : {lesson.lesson_title}</h4>
                                                </div>
                                            </div>

                                            {openAccId === lesson.lesson_id && <>
                                                {lesson.content.length < 1 ? <p className={styles.noLessons}>No content for this lesson</p>
                                                :
                                                lesson.content.map((cont, i) => (
                                                    <div className={styles.week} key={i} onClick={()=>handleDownload(cont.file_id)}>
                                                        <div className={styles.title}>
                                                            <input type="checkbox" name="check" id="check" checked={cont.completed} readOnly />                                                                    
                                                            <h4>{cont.file_name}</h4>
                                                        </div>
                                                        
                                                        <div className={styles.len}>
                                                            <img src="" alt="" />
                                                            File size: {Math.floor(cont.file_size / 1000)}KB
                                                        </div>
                                                    </div>

                                                ))}
                                            </>}
                                        </>

                                    ))}
                                </div>
                            </div>

                        </div>

                    </div >
                }
            </div>
        </>
    )
}