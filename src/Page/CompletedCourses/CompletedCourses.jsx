import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./CompletedCourses.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export const CompletedCourse = () => {

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


    return (
        <>
            <div className={styles.whole}>
                
                <div className={styles.breadcrumb}><a href="/dashboard/courses">Courses</a> {'>'} Completed</div>
                
                <div>
                    <div className={styles.title}>
                        <h1>Completed Courses <span>({courses.length})</span></h1>
                        <button><img src={getImageUrl('sort.png')} alt="" /></button>
                    </div>
                    
                    <div className={styles.course}>
                        {courses.map((cour, index) => (
                            <div className={styles.courseInfo}>
                                <div className={styles.infoHeader}>
                                    <div><h3>{cour.title}<span>{cour.location}</span></h3></div>
                                    <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                                </div>
                                <p>{cour.description}</p>
                                <div className={styles.courseData}>
                                    <div className={styles.bread}>
                                        <div className={styles.profile}><img src={getImageUrl('profile.svg')} alt="" />{cour.teacher}</div>
                                        <div className={styles.students}><img src={getImageUrl('pic.png')} alt="" />{cour.students} Students</div>
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
                </div>
            </div>
        </>
    )


}