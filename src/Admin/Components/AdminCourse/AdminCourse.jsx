import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./AdminCourse.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Modal from "./Modal";

export const AdminCourse = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ open, setOpen ] = useState(false);
    const [ buttonType, setButtonType ] = useState("");
    const [ actionsOpen, setActionsOpen ] = useState({});
    const actionsRef = useRef(null);
    const createRef = useRef(null);



    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = (type) => {
        setButtonType(type);
        setOpen(true);
    };
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const toggleDropdown2 = () => {

    };
    
    const toggleAction = (index) => {
        setActionsOpen(prevState => ({
            ...prevState,
            [index]: !prevState[index]
        }));
    };
    const handleClickOutside = (event) => {
        if (actionsRef.current && !actionsRef.current.contains(event.target)) {
            setActionsOpen(false);
        }
        if (createRef.current && !createRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

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
    

    return (
        <>
        <div className={styles.whole}>
            <h5>Courses </h5>
            <div>
                <div className={styles.title}>
                    <h1>Active Courses</h1>
                    <div className={styles.buttons}>
                        <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                        <button className={styles.buttonTwo} onClick={toggleDropdown} ><img src={getImageUrl('add.png')} />Create Event</button>
                    </div>
                    {isOpen && (
                        <ul className={styles.createDiv} ref={createRef}>
                            <button onClick={() => handleOpen("COURSE")}><img src={getImageUrl('courseIcon.png')} />COURSE</button>
                            <button onClick={() => handleOpen("ASSIGNMENTS")}><img src={getImageUrl('assignments.png')} />ASSIGNMENTS</button>
                            <button onClick={() => handleOpen("QUIZ")}><img src={getImageUrl('quizIcon.png')} />QUIZ</button>
                        </ul>
                    )}
                    <Modal isOpen={open} >
                        <>
                        <div className={styles.course_modal}>
                            <div className={styles.head}>
                                <h3>{buttonType === "COURSE" ? "Create Course" : buttonType === "ASSIGNMENTS" ? "Create Assignment" : "Create Quiz"}</h3>
                                <button onClick={handleClose} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                            </div>
                            <div className={styles.content}>
                                <div>
                                    <h5>{buttonType === "COURSE" ? "Event Name" : buttonType === "ASSIGNMENTS" ? "Content title" : "Event Name"}</h5>
                                    <input type="text" placeholder="Enter Event Name"></input>
                                </div>
                                <div>
                                    <h5>{buttonType === "COURSE" ? "Event Type" : buttonType === "ASSIGNMENTS" ? "Duration" : "Event Type"}</h5>
                                    <select name="" id="" onClick={toggleDropdown2}>
                                        <option value="">Select Event Type</option>
                                    </select>
                                </div>

                            </div>
                            <div className={styles.contain}>
                                <div>
                                    <h5>Start Date & Time</h5>
                                    <input type="datetime" name="" id="" />
                                    {/* <button onClick={toggleDropdown2}><span>Select Date & Time</span> <img src={getImageUrl('arrown_down_black.png')} alt="" /></button> */}
                                </div>
                                <div>
                                    <h5>Due Date</h5>
                                    <input type="date" name="" id="" />
                                    {/* <button onClick={toggleDropdown2}><span>Select Due Date</span> <img src={getImageUrl('arrown_down_black.png')} alt="" /></button> */}
                                </div>
                            </div>
                            <button className={styles.submit}>Submit</button>
                        </div>
                        </>
                    </Modal>
                </div>

                <div className={styles.course}>
                    {courses.map((cour, index) => (
                        <div className={styles.courseInfo} >
                            <div className={styles.courseImage}>
                                <img src={getImageUrl('frame7.png')} />
                            </div>
                            <div className={styles.infoHeader}>
                                <div><h3>Artificial Intelligence<span>Started</span></h3></div>
                                <div>
                                    <button className={styles.actionsButton} onClick={() => toggleAction(index)}><img src={getImageUrl('threeDots.png')} /></button>
                                    <div className={`${styles.actionsClosed} ${actionsOpen[index] && styles.theActions}`} ref={actionsRef}>
                                        <h5>ACTION</h5>
                                        <button><img src={getImageUrl('approve.png')} />SUSPEND</button>
                                        <button><img src={getImageUrl('delete.png')} />DECLINE</button>
                                    </div>
                                </div>
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
                </div>
            </div>
        </div>
        </>
    )


}