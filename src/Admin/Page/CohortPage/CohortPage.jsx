import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./CohortPage.module.css";
import axios from 'axios';
import { format } from "date-fns";
import Modal from "../ActiveCourses/Modal";

export const CohortPage = () => {

    const [ isOpenCohort, setIsOpenCohort ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);


    const cohorts = [
        {
            number: 1,
            description: 'Description',
            startDate: '2024-01-01',
            endDate: '2024-04-30',
            studentsNo: 124,
            totalCourses: 8,
            completedCourses: 5
        },
        {
            number: 2,
            description: 'Description',
            startDate: '2024-05-01',
            endDate: '2024-08-31',
            studentsNo: 124,
            totalCourses: 8,
            completedCourses: 8
        },
        {
            number: 3,
            description: 'Description',
            startDate: '2024-09-01',
            endDate: '2024-12-31',
            studentsNo: 124,
            totalCourses: 10,
            completedCourses: 3
        },
    ]

    function handleViewCohort(id) {
        window.location.href = `/admin-dashboard/cohort/${id}`;
    }

    return (
        <>

        <div className={styles.whole}>

            <div className={styles.breadcrumb}><a href="/admin-dashboard/overview">Home</a> {'>'} Cohorts</div>

            <div>
                <div className={styles.title}>
                    <h3>All Cohorts</h3>
                    <div className={styles.buttons}>
                        <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} alt="" /></button>
                        <button className={styles.buttonTwo} onClick={()=>setIsOpenCohort(true)}>
                            <img src={getImageUrl('whitePlus.png')} alt="" />
                            Add New Cohort
                        </button>
                    </div>
                </div>

                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :
                
                    cohorts.length === 0 ?
                        
                        <p className={styles.none}>No Cohorts Found</p>
                        :
                        <div className={styles.cohorts}>

                            {cohorts.map((coho, index) => (
                                <div className={styles.cohortBox}>
                                    <div className={styles.infoHeader}>
                                        <div>
                                            <h3>Cohort {coho.number}</h3>
                                            <p>{coho.description}</p>
                                        </div>
                                        <div className={styles.number}>{coho.number}</div>
                                    </div>
                                    <div className={styles.cohortData}>
                                        <div>
                                            <img src={getImageUrl('blueCalendar.png')} alt="" />
                                            {format( new Date(coho.startDate), 'MMMM')} - {format( new Date(coho.endDate), 'MMMM')}
                                        </div>
                                        <div>
                                            <img src={getImageUrl('forStudents.png')} alt="" />
                                            {coho.studentsNo} Students
                                        </div>
                                    </div>
                                    <div className={styles.cohortLoader}>
                                        <p>{coho.completedCourses}/{coho.totalCourses}</p>
                                        <progress className={`${coho.totalCourses === coho.completedCourses ? styles.complete : ''} ${styles.progress}`} id="progress" max={coho.totalCourses} value={coho.completedCourses} />
                                    </div>
                                    <button className={styles.viewButton} onClick={()=>handleViewCohort(coho.number)}>
                                        <img src={getImageUrl('view.png')} alt="" />
                                        View
                                    </button>
                                </div>
                            ))}
                            
                        </div>
                }
            </div>
        </div>

        <Modal isOpen={isOpenCohort}>
            <div className={styles.addCohort}>
                <div className={styles.head}>
                    <h3>Create Cohort</h3>
                    <button onClick={()=>setIsOpenCohort(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>

                <form action={''} className={styles.contentBody}>
                    
                    <div className={styles.form}>
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" id="title" placeholder="Enter cohort title" />
                    </div>
                    
                    <div className={styles.form}>
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="" placeholder="Enter description"></textarea>
                    </div>
                    
                    <div className={styles.flex}>
                        <div className={styles.form}>
                            <label htmlFor="title">Start Date</label>
                            <input type="date" name="start_date" id="start_date" />
                        </div>

                        <div className={styles.form}>
                            <label htmlFor="title">End Date</label>
                            <input type="date" name="end_date" id="end_date" placeholder="Enter cohort title" />
                        </div>
                        
                    </div>

                </form>

                <button className={styles.cohortButton} type="button">Submit</button>

            </div>
        </Modal>
        </>
    )
}