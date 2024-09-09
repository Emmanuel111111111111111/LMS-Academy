import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./Course.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const Course = () => {

    const [currentPage, setCurrentPage] = useState(1);

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
        {
            title: 'Course Title 7',
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
            title: 'Course Title 8',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 7,
            totalLessons: 12,
            currentAssignment: 5,
            duration: '10 weeks',
            students: 72,
            location: 'Physical'
        }
    ]

    const events = [
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'July 1, 2024'
        },
        {
            courseName: 'Oracle',
            eventType: 'CLASS',
            dueTime: '12:38:00 PM',
            dueDate: 'July 25, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 1, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 22, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'CLASS',
            dueTime: '12:38:00 PM',
            dueDate: 'August 29, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 1, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'July 1, 2024'
        },
        {
            courseName: 'Oracle',
            eventType: 'CLASS',
            dueTime: '12:38:00 PM',
            dueDate: 'July 25, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 1, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 22, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'CLASS',
            dueTime: '12:38:00 PM',
            dueDate: 'August 29, 2024'
        }
    ]

    const itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            <div className={styles.whole}>
                <h5>Courses <img src={getImageUrl('Icons12.png')} alt="" /> <a href="">Active</a></h5>
                <div>
                    <div className={styles.title}>
                        <h1>Active Courses <span>(10)</span></h1>
                        <button><img src={getImageUrl('sort.png')} alt="" /></button>
                    </div>
                    
                    <div className={styles.course}>
                        {courses.map((cour, index) => (
                            <div className={styles.courseInfo}>
                                <div className={styles.infoHeader}>
                                    <h3>{cour.title}<span>{cour.location}</span></h3>
                                    <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                                </div>
                                <p>{cour.description}</p>
                                <div className={styles.courseData}>
                                    <div className={styles.bread}>
                                        <div className={styles.profile}><img src={getImageUrl('profile.png')} alt="" />{cour.teacher}</div>
                                        <div className={styles.students}><img src={getImageUrl('pic.png')} alt="" />{cour.students} Students</div>
                                    </div>
                                    <div className={styles.crumb}>
                                        <div className={styles.profile}><img src={getImageUrl('timer.png')} alt="" />{cour.duration}</div>
                                        <div className={styles.profile}><img src={getImageUrl('lesson.png')} alt="" />{cour.totalLessons} Modules</div>
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