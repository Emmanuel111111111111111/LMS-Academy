import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./Certificate.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const Certificate = () => {

    const [currentPage, setCurrentPage] = useState(1);

    const certificates = [
        {
            title: 'Course Title 1',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 12,
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
            currentLesson: 12,
            totalLessons: 12,
            currentAssignment: 6,
            duration: '10 weeks',
            students: 72,
            location: 'Physical'
        },
        {
            title: 'Course Title 3',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 12,
            totalLessons: 12,
            currentAssignment: 6,
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
        <div className={styles.whole}>
            <h5>Certificate</h5>
            <div>
                <div className={styles.title}>
                    <h1>All Certificate</h1>
                    <button><img src={getImageUrl('sort.png')} alt="" /></button>
                </div>
                <div className={styles.course}>

                    {certificates.map((certif, index) => (
                        <div className={styles.courseInfo}>
                            <div className={styles.courseImage}>
                                <img src={getImageUrl("frame11.png")} alt="h" />
                            </div>
                            <div className={styles.certInfo}>
                                <div className={styles.infoHeader}>
                                    <h3>{certif.title}<span>{certif.location}</span></h3>
                                    <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                                </div>
                                <p>{certif.description}</p>
                                <div className={styles.courseData}>
                                    <div className={styles.bread}>
                                        <div className={styles.profile}><img src={getImageUrl('profile.png')} alt="" />{certif.teacher}</div>
                                    </div>
                                    <div className={styles.crumb}>
                                        <div className={styles.profile}><img src={getImageUrl('lesson.png')} alt="" />Lesson 16</div>
                                        <div className={styles.profile}><img src={getImageUrl('assignment.png')} alt="" />Assignment 07</div>
                                        <div className={styles.profile}><img src={getImageUrl('timee.png')} alt="" />7h 25m</div>
                                    </div>
                                </div>
                                <div className={styles.withLoader}>
                                    <div className={styles.coursesLoader}>
                                        <p>12/12</p>
                                        <progress className={styles.progress} id="progress" max={30} value={30} />
                                    </div>
                                    <div className={styles.butt}>
                                        <button className={styles.bb}>View Certificate</button>
                                        <button className={styles.gf}>Download</button>
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