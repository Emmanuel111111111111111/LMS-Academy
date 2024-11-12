import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./CohortPage.module.css";
import axios from 'axios';
import { format } from "date-fns";
import Modal from "../ActiveCourses/Modal";
import { useParams } from "react-router-dom";
import Pagination from "../../../Components/Pagination/Pagination";

export const CohortDetails = () => {

    const { id } = useParams();

    const [ isOpenCourse, setIsOpenCourse ] = useState(false);
    const [ cohort, setCohort ] = useState({});
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const scroll = useRef(null);
    const actionsRef = useRef(null);


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

    const courses = [
        {
            title: 'General',
            studentNo: 156,
            classNo: 5
        },
        {
            title: 'Project Management Essentials',
            studentNo: 31,
            classNo: 1
        },
        {
            title: 'Financial Accounting Basincs',
            studentNo: 25,
            classNo: 15
        },
        {
            title: 'Foundations of Cybersecurity',
            studentNo: 50,
            classNo: 8
        },
        {
            title: 'Introductio to Digital Marketing',
            studentNo: 32,
            classNo: 23
        },
        {
            title: 'Something something',
            studentNo: 2,
            classNo: 4
        },
        {
            title: 'Something else',
            studentNo: 1,
            classNo: 10
        },
    ]

    useEffect(() => {
        const cohortId = parseInt(id, 10);
        const selectedCohort = cohorts.find(c => c.number === cohortId);
        if (selectedCohort) {
            setCohort(selectedCohort);
        }
    }, [id]);


    function handleViewCohort(id) {
        window.location.href = `/admin-dashboard/cohort/${id}`;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageNumber = (itemNumber) => {
        setItemsPerPage(itemNumber);
        setCurrentPage(1);
        scroll.current.scrollIntoView();
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
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return (
        <>

        <div className={styles.whole}>

            {(!cohort.number) ? <p className={styles.loading}>Loading</p> :

                <>
                <div className={styles.breadcrumb}><a href="/admin-dashboard/overview">Home</a> {'>'} <a href="/admin-dashboard/cohort">Cohorts</a> {'>'} Cohort {cohort.number}</div>

                <div>
                    <div className={styles.title}>
                        <h3>Cohort {cohort.number} Details</h3>
                        <div className={styles.buttons}>
                            <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} alt="" /></button>
                            <button className={styles.buttonTwo} onClick={()=>setIsOpenCourse(true)}>
                                <img src={getImageUrl('whitePlus.png')} alt="" />
                                Add Course
                            </button>
                        </div>
                    </div>

                    <div className={styles.whiteBox}>
                        <div className={styles.headerBox}>
                            <h3>Cohort {cohort.number}</h3>
                            <p>{cohort.description}</p>
                            <div className={styles.cohortData}>
                                <div>
                                    <img src={getImageUrl('blueCalendar.png')} alt="" />
                                    {format( new Date(cohort.startDate), 'MMMM')} - {format( new Date(cohort.endDate), 'MMMM')}
                                </div>
                                <div>
                                    <img src={getImageUrl('forStudents.png')} alt="" />
                                    {cohort.studentsNo} Students
                                </div>
                            </div>
                            <div className={styles.cohortLoader2}>
                                <p>{cohort.completedCourses}/{cohort.totalCourses}</p>
                                <progress className={`${cohort.totalCourses === cohort.completedCourses ? styles.complete : ''} ${styles.progress}`} id="progress" max={cohort.totalCourses} value={cohort.completedCourses} />
                            </div>
                        </div>
                        
                        <table className={styles.cohortTable}>
                            <thead>
                                <th><input type="checkbox" /></th>
                                <th>Course Title</th>
                                <th>No. Of Students</th>
                                <th>No. of Classes</th>
                                <th>Action</th>
                            </thead>
                            <tbody>
                                {currentCourses.map((cour, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{cour.title}</td>
                                        <td>{cour.studentNo}</td>
                                        <td>{cour.classNo}</td>
                                        <td>
                                            <button className={styles.actionsButton} onClick={()=>toggleAction(index)}><img src={getImageUrl('threeDots.png')} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div style={{ w:'100%', display:"flex", alignItems:'center' }}>
                            <div className={styles.showRows}>
                                Show
                                <select onChange={(e) => handlePageNumber(e.target.value)} >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                </select>
                                Rows
                            </div>
                            <Pagination className={styles.pag}
                                currentData={courses}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                            />

                        </div>

                    </div>
                
                </div>
                </>
            }
        </div>

        <Modal isOpen={isOpenCourse}>
            <div className={styles.addCohort}>
                <div className={styles.head}>
                    <div>
                        <h3>Add Course</h3>
                        <p>Cohort {cohort.number}</p>
                    </div>
                    <button onClick={()=>setIsOpenCourse(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>

                <form action={''} className={styles.contentBody}>
                    
                    {/* <div className={styles.form}>
                        <label htmlFor="title">Course Title</label>
                        <input type="text" name="title" id="title" placeholder="Enter course title" />
                    </div> */}
                    
                    <div className={styles.form}>
                        <label htmlFor="course">Course</label>
                        <select name="course" id="course">
                            <option value="">Select course</option>
                        </select>
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