import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./CourseDetails.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
            const result = await axios(BASE_URL + `/courses-instructor-studentscount-lessons`);
            console.log(result.data.filter(e => e.course_id === courseID)[0]);
            setCourse(result.data.filter(e => e.course_id === courseID)[0]);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            // setErrorMessage(true);
        }
    }

    const weeks = [
        {
            id: 1,
            completed: false,
            content: [
                {
                    id: 1,
                    title: 'What is User Experience (UX) Design',
                    type: 'video',
                    length: '4 min',
                    completed: false
                },
                {
                    id: 2,
                    title: 'Historical Overview of UX Design',
                    type: 'video',
                    length: '4 min',
                    completed: true
                },
                {
                    id: 3,
                    title: 'Understanding User-Centered Design',
                    type: 'video',
                    length: '4 min',
                    completed: false
                },
                {
                    id: 4,
                    title: 'The Role of UX Design in Digital Products',
                    type: 'video',
                    length: '4 min',
                    completed: false
                },
                {
                    id: 5,
                    title: 'Introduction to UX Design Tools and Techniques',
                    type: 'text',
                    length: '4 min',
                    completed: true
                },
                
            ]
        },
        {
            id: 2,
            completed: false,
            content: [
                {
                    id: 1,
                    title: 'Introduction to UX Design Tools and Techniques',
                    type: 'text',
                    length: '4 min',
                    completed: true
                },
                
            ]
        },
        {
            id: 3,
            completed: false,
            content: [
                {
                    id: 1,
                    title: 'Historical Overview of UX Design',
                    type: 'video',
                    length: '4 min',
                    completed: true
                },
                {
                    id: 2,
                    title: 'Understanding User-Centered Design',
                    type: 'video',
                    length: '4 min',
                    completed: false
                },
            ]
        },
        {
            id: 4,
            completed: false,
            content: [
                {
                    id: 1,
                    title: 'What is User Experience (UX) Design',
                    type: 'video',
                    length: '4 min',
                    completed: false
                }
                
            ]
        },
    ]

    const [ openAccId, setOpenAccId ] = useState(null);
    const toggleAccordion = (id) => {
        setOpenAccId(openAccId === id ? null : id );
    }


    return (
        <>

        <div className={styles.whole}>

            <div className={styles.breadcrumb}><a href="/dashboard/courses">Courses</a> {'>'} <a href="/dashboard/courses">Active</a> {'>'} {course.name} User Experience Design (UX)</div>

            {/* {isLoading ? <p className={styles.loading}>Loading...</p> : */}

            <div className={styles.split}>

                <div className={styles.larger}>

                    <div className={styles.courseTitle}>
                        <div>
                            <h3>{course.name} User Experience Design (UX)</h3>
                            <div className={styles.titleInfo}>
                                <div className={styles.teach}>
                                    <img src={getImageUrl('profile.svg')} alt="" />
                                    Arafat Murad
                                </div>
                                <div className={styles.stud}>
                                    <div className={styles.stack}>
                                        <img src={getImageUrl('profile.svg')} alt="" />
                                        <img src={getImageUrl('teach.svg')} alt="" />
                                        <img src={getImageUrl('profile.svg')} alt="" />
                                    </div>
                                    56 Registered students
                                </div>
                            </div>
                            <div className={styles.loc}>
                                Physical
                            </div>
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
                        <div className={styles.details}>
                            <h3>Course Overview</h3>
                            <p>Embark on a transformative journey into the dynamic world of User Experience (UX) Design
                                with our comprehensive course, "Introduction to User Experience Design."
                                This course is meticulously crafted to provide you with a foundational understanding of the principles,
                                methodologies, and tools that drive exceptional user experiences in the digital landscape.
                            </p>

                            <h3>Key Learning Objectives</h3>
                            <ul>
                                <li>Gain a clear understanding of what User Experience (UX) Design entails and its importance in today's digital world.</li>
                                <li>Explore the fundamental principles of user-centered design and how to apply them to create intuitive and user-friendly interfaces.</li>
                                <li>Learn about the various elements that contribute to a positive user experience, including information architecture, interaction design, and visual design.</li>
                            </ul>
                        </div>

                        <div className={styles.details}>
                            <h3>Instructor</h3>
                            <h4>Ronald Richards</h4>
                            <h5>UI/UX Designer</h5>
                            
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

                            <h5>With over a decade of industry experience,
                                Ronald brings a wealth of practical knowledge to the classroom.
                                He has played a pivotal role in designing user-centric interfacesfor renowned tech companies,
                                ensuring seamless and engaging user experiences.
                            </h5>
                            
                        </div>
                    </div>

                </div>



                <div className={styles.smaller}>

                    <div className={styles.completion}>
                        <h3>Course Completion</h3>


                        <div className={styles.accordionDiv}>
                            {weeks.map((week, i) => (
                                <>
                                <div key={week.id} className={styles.accordion}>
                                    <div className={styles.accHeader} onClick={()=>toggleAccordion(week.id)}>
                                        <span style={{
                                            ...styles.arrow,
                                            transform: openAccId === week.id ? 'rotate(180deg)' : 'rotate(0deg)'
                                        }}>
                                            ^
                                        </span>
                                        <h4>Week {week.id}</h4>
                                    </div>
                                    
                                </div>
                                {openAccId === week.id && week.content.map((cont, i) => (
                                    <div className={styles.week} key={i}>
                                        
                                        <label htmlFor="check" className={styles.title}>
                                            <input type="checkbox" name="check" id="check" />
                                            <h5>{cont.id}.</h5>
                                            <h4>{cont.title}</h4>
                                        </label>
                                            
                                        <div className={styles.len}>
                                            <img src="" alt="" />
                                            {cont.length}
                                        </div>
                                    </div>
                                ))}
                                </>
                            ))}
                        </div>
                    </div>

                </div>

            </div >
            {/* } */}
        </div>
        </>
    )
}