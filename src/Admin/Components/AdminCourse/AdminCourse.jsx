import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./AdminCourse.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const AdminCourse = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    // v
    const courses = [
        {
            title: 'Course Title 1',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 7,
            totalLessons: 12,
            currentAssignment: 6,
            duration: '10 weeks',
            students: 72,
            location: 'Physical'
        },
        {
            title: 'Course Title 2',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 16,
            totalLessons: 30,
            currentAssignment: 7,
            duration: '10 weeks',
            students: 72,
            location: 'Physical'
        },
        {
            title: 'Course Title 3',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 7,
            totalLessons: 12,
            currentAssignment: 5,
            duration: '10 weeks',
            students: 72,
            location: 'Physical'
        },
        {
            title: 'Course Title 4',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 7,
            totalLessons: 12,
            currentAssignment: 5,
            duration: '10 weeks',
            students: 72,
            location: 'Physical'
        },
        {
            title: 'Course Title 5',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 7,
            totalLessons: 12,
            currentAssignment: 5,
            duration: '10 weeks',
            students: 72,
            location: 'Physical'
        },
        {
            title: 'Course Title 6',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 7,
            totalLessons: 12,
            currentAssignment: 5,
            duration: '10 weeks',
            students: 72,
            location: 'Physical'
        },
        // {
        //     title: 'Course Title 7',
        //     description: 'A short lesson description...',
        //     teacher: 'Arafat Murad',
        //     currentLesson: 7,
        //     totalLessons: 12,
        //     currentAssignment: 5,
        //     duration: '10 weeks',
        //     students: 72,
        //     location: 'Physical'
        // },
        // {
        //     title: 'Course Title 8',
        //     description: 'A short lesson description...',
        //     teacher: 'Arafat Murad',
        //     currentLesson: 7,
        //     totalLessons: 12,
        //     currentAssignment: 5,
        //     duration: '10 weeks',
        //     students: 72,
        //     location: 'Physical'
        // }
    ]
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentTeachers = teachers.slice(indexOfFirstItem, indexOfLastItem);

    // const handlePageChange = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };

    // const handlePageNumber = (itemNumber) => {
    //     setItemsPerPage(itemNumber);
    //     setCurrentPage(1);
    //     scroll.current.scrollIntoView();
    // };

    // const toggleAction = (index) => {
    //     setActionsOpen(prevState => ({
    //         ...prevState,
    //         [index]: !prevState[index]
    //     }));
    // };

    // const handleClickOutside = (event) => {
    //     if (actionsRef.current && !actionsRef.current.contains(event.target)) {
    //         setActionsOpen(false);
    //     }
    // };
    // useEffect(() => {
    //     document.addEventListener('click', handleClickOutside, true);
    //     return () => {
    //         document.removeEventListener('click', handleClickOutside, true);
    //     };
    // }, []);


    return (
        <>
            <div className={styles.whole}>
                <h5>Courses </h5>
                <div>
                    <div className={styles.title}>
                        <h1>Active Courses</h1>
                        <div className={styles.buttons}>
                    <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                    <button className={styles.buttonTwo}><img src={getImageUrl('add.png')} />Create Event</button>
                </div>
                    </div>
                    
                    <div className={styles.course}>
                        {courses.map((cour, index) => (
                            <div className={styles.courseInfo}>
                                <div className={styles.courseImage}>
                                   <img src={getImageUrl('frame7.png')} />
                                </div>
                                <div className={styles.infoHeader}>
                                    <div><h3>Artificial Intelligence<span>Started</span></h3></div>
                                    <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                                </div>
                                <p>Lorem ipsum dolor sit amet consectetur. Feugia t blandit turpis.Lorem ipsum dolor sit amet consector.
                                    Feugia t blandit turpis...  </p>
                                <div className={styles.courseData}>
                                    <div className={styles.bread}>
                                        <div className={styles.profile}><img src={getImageUrl('calend.png')} alt="" />Monday, 28 June -28 August 2024</div>
                                         <div className={styles.profile}><img src={getImageUrl('timeline.png')} alt="" />A Month</div>
                                    </div>
                                    <div className={styles.crumb}>
                                        <div className={styles.profile}><img src={getImageUrl('profile.png')} alt="" />{cour.teacher}</div>
                                        <div className={styles.students}><img src={getImageUrl('frame5.png')} alt="" />{cour.students} Students</div>
                                    </div>
                                </div>
                                
                            </div>
                        ))}
                        

                        {/* <div className={styles.courseInfo}>
                            <div className={styles.infoHeader}>
                                <h3>Course Title 1 <span>Physical</span></h3>
                                <button><img src={getImageUrl('Vector.png')} alt="" /></button>
                            </div>
                            <p>A short lesson description...</p>
                            <div className={styles.courseData}>
                                <div className={styles.bread}>
                                    <div className={styles.profile}><img src={getImageUrl('prof.png')} alt="" />Arafat Murad</div>
                                    <div className={styles.profile}><img src={getImageUrl('Students.png')} alt="" />72 Students</div>
                                </div>
                                <div className={styles.crumb}>
                                    <div className={styles.profile}><img src={getImageUrl('timer.png')} alt="" />10 Weeks</div>
                                    <div className={styles.profile}><img src={getImageUrl('lesson.png')} alt="" />16 Modules</div>
                                    <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />10am Wed-Fri</div>
                                </div>
                            </div>
                            <div className={styles.withLoader}>
                                <div className={styles.coursesLoader}>
                                    <p>7/12 Modules</p>
                                    <progress className={styles.progress} id="progress" max={150} value={50} />
                                </div>
                                <button>Continue Course</button>
                            </div>
                        </div>
                        <div className={styles.courseInfo}>
                            <div className={styles.infoHeader}>
                                <h3>Course Title 1 <span>Physical</span></h3>
                                <button><img src={getImageUrl('Vector.png')} alt="" /></button>
                            </div>
                            <p>A short lesson description...</p>
                            <div className={styles.courseData}>
                                <div className={styles.bread}>
                                    <div className={styles.profile}><img src={getImageUrl('prof.png')} alt="" />Arafat Murad</div>
                                    <div className={styles.profile}><img src={getImageUrl('Students.png')} alt="" />72 Students</div>
                                </div>
                                <div className={styles.crumb}>
                                    <div className={styles.profile}><img src={getImageUrl('timer.png')} alt="" />10 Weeks</div>
                                    <div className={styles.profile}><img src={getImageUrl('lesson.png')} alt="" />16 Modules</div>
                                    <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />10am Wed-Fri</div>
                                </div>
                            </div>
                            <div className={styles.withLoader}>
                                <div className={styles.coursesLoader}>
                                    <p>7/12 Modules</p>
                                    <progress className={styles.progress} id="progress" max={10} value={9} />
                                </div>
                                <button>Continue Course</button>
                            </div>
                        </div>
                        <div className={styles.courseInfo}>
                            <div className={styles.infoHeader}>
                                <h3>Course Title 1 <span>Physical</span></h3>
                                <button><img src={getImageUrl('Vector.png')} alt="" /></button>
                            </div>
                            <p>A short lesson description...</p>
                            <div className={styles.courseData}>
                                <div className={styles.bread}>
                                    <div className={styles.profile}><img src={getImageUrl('prof.png')} alt="" />Arafat Murad</div>
                                    <div className={styles.profile}><img src={getImageUrl('Students.png')} alt="" />72 Students</div>
                                </div>
                                <div className={styles.crumb}>
                                    <div className={styles.profile}><img src={getImageUrl('timer.png')} alt="" />10 Weeks</div>
                                    <div className={styles.profile}><img src={getImageUrl('lesson.png')} alt="" />16 Modules</div>
                                    <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />10am Wed-Fri</div>
                                </div>
                            </div>
                            <div className={styles.withLoader}>
                                <div className={styles.coursesLoader}>
                                    <p>7/12 Modules</p>
                                    <progress className={styles.progress} id="progress" max={150} value={50} />
                                </div>
                                <button>Continue Course</button>
                            </div>
                        </div>
                        <div className={styles.courseInfo}>
                            <div className={styles.infoHeader}>
                                <h3>Course Title 1 <span>Physical</span></h3>
                                <button><img src={getImageUrl('Vector.png')} alt="" /></button>
                            </div>
                            <p>A short lesson description...</p>
                            <div className={styles.courseData}>
                                <div className={styles.bread}>
                                    <div className={styles.profile}><img src={getImageUrl('prof.png')} alt="" />Arafat Murad</div>
                                    <div className={styles.profile}><img src={getImageUrl('Students.png')} alt="" />72 Students</div>
                                </div>
                                <div className={styles.crumb}>
                                    <div className={styles.profile}><img src={getImageUrl('timer.png')} alt="" />10 Weeks</div>
                                    <div className={styles.profile}><img src={getImageUrl('lesson.png')} alt="" />16 Modules</div>
                                    <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />10am Wed-Fri</div>
                                </div>
                            </div>
                            <div className={styles.withLoader}>
                                <div className={styles.coursesLoader}>
                                    <p>7/12 Modules</p>
                                    <progress className={styles.progress} id="progress" max={150} value={50} />
                                </div>
                                <button>Continue Course</button>
                            </div>
                        </div>
                        <div className={styles.courseInfo}>
                            <div className={styles.infoHeader}>
                                <h3>Course Title 1 <span>Physical</span></h3>
                                <button><img src={getImageUrl('Vector.png')} alt="" /></button>
                            </div>
                            <p>A short lesson description...</p>
                            <div className={styles.courseData}>
                                <div className={styles.bread}>
                                    <div className={styles.profile}><img src={getImageUrl('prof.png')} alt="" />Arafat Murad</div>
                                    <div className={styles.profile}><img src={getImageUrl('Students.png')} alt="" />72 Students</div>
                                </div>
                                <div className={styles.crumb}>
                                    <div className={styles.profile}><img src={getImageUrl('timer.png')} alt="" />10 Weeks</div>
                                    <div className={styles.profile}><img src={getImageUrl('lesson.png')} alt="" />16 Modules</div>
                                    <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />10am Wed-Fri</div>
                                </div>
                            </div>
                            <div className={styles.withLoader}>
                                <div className={styles.coursesLoader}>
                                    <p>7/12 Modules</p>
                                    <progress className={styles.progress} id="progress" max={150} value={50} />
                                </div>
                                <button>Continue Course</button>
                            </div>
                        </div>
                        <div className={styles.courseInfo}>
                            <div className={styles.infoHeader}>
                                <h3>Course Title 1 <span>Physical</span></h3>
                                <button><img src={getImageUrl('Vector.png')} alt="" /></button>
                            </div>
                            <p>A short lesson description...</p>
                            <div className={styles.courseData}>
                                <div className={styles.bread}>
                                    <div className={styles.profile}><img src={getImageUrl('prof.png')} alt="" />Arafat Murad</div>
                                    <div className={styles.profile}><img src={getImageUrl('Students.png')} alt="" />72 Students</div>
                                </div>
                                <div className={styles.crumb}>
                                    <div className={styles.profile}><img src={getImageUrl('timer.png')} alt="" />10 Weeks</div>
                                    <div className={styles.profile}><img src={getImageUrl('lesson.png')} alt="" />16 Modules</div>
                                    <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />10am Wed-Fri</div>
                                </div>
                            </div>
                            <div className={styles.withLoader}>
                                <div className={styles.coursesLoader}>
                                    <p>7/12 Modules</p>
                                    <progress className={styles.progress} id="progress" max={150} value={50} />
                                </div>
                                <button>Continue Course</button>
                            </div>
                        </div>
                        <div className={styles.courseInfo}>
                            <div className={styles.infoHeader}>
                                <h3>Course Title 1 <span>Physical</span></h3>
                                <button><img src={getImageUrl('Vector.png')} alt="" /></button>
                            </div>
                            <p>A short lesson description...</p>
                            <div className={styles.courseData}>
                                <div className={styles.bread}>
                                    <div className={styles.profile}><img src={getImageUrl('prof.png')} alt="" />Arafat Murad</div>
                                    <div className={styles.profile}><img src={getImageUrl('Students.png')} alt="" />72 Students</div>
                                </div>
                                <div className={styles.crumb}>
                                    <div className={styles.profile}><img src={getImageUrl('timer.png')} alt="" />10 Weeks</div>
                                    <div className={styles.profile}><img src={getImageUrl('lesson.png')} alt="" />16 Modules</div>
                                    <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />10am Wed-Fri</div>
                                </div>
                            </div>
                            <div className={styles.withLoader}>
                                <div className={styles.coursesLoader}>
                                    <p>7/12 Modules</p>
                                    <progress className={styles.progress} id="progress" max={150} value={50} />
                                </div>
                                <button>Continue Course</button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )


}