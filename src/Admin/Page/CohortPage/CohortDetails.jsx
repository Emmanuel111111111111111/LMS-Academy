import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./CohortPage.module.css";
import axios from 'axios';
import { format } from "date-fns";
import Modal from "../ActiveCourses/Modal";
import { useParams } from "react-router-dom";
import Pagination from "../../../Components/Pagination/Pagination";
import { BASE_URL, TEST_URL } from "../../../../config";

export const CohortDetails = () => {

    const { id } = useParams();

    const [ isOpenCourse, setIsOpenCourse ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ cohort, setCohort ] = useState({});
    const [ allCourses, setAllCourses ] = useState([]);

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const scroll = useRef(null);
    const actionsRef = useRef(null);


    useEffect(() => {
        fetchCohortData();
        fetchAllCourses();
    }, [id]);


    const fetchCohortData = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/cohorts-details/${id}`);
            console.log(result.data[0]);
            setCohort(result.data[0])
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }

    const fetchAllCourses = async () => {
        try {
            const result = await axios(BASE_URL + `/courses`);
            setAllCourses(result.data)
        } catch (err) {
            console.log(err);
        }
    }

    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = cohort.course?.slice(indexOfFirstItem, indexOfLastItem);

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

            {(!cohort.cohort_id || isLoading) ? <p className={styles.loading}>Loading...</p> :

                <>
                <div className={styles.breadcrumb}><a href="/admin-dashboard/overview">Home</a> {'>'} <a href="/admin-dashboard/cohort">Cohorts</a> {'>'} {cohort.cohort_name}</div>

                <div>
                    <div className={styles.title}>
                        <h3>{cohort.cohort_name} Details</h3>
                        <div className={styles.buttons}>
                            {/* <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} alt="" /></button> */}
                            <button className={styles.buttonTwo} onClick={()=>setIsOpenCourse(true)}>
                                <img src={getImageUrl('whitePlus.png')} alt="" />
                                Add Course
                            </button>
                        </div>
                    </div>

                    <div className={styles.whiteBox}>
                        <div className={styles.headerBox}>
                            <h3>Cohort {cohort.cohort_number}</h3>
                            <p>{cohort.description}</p>
                            <div className={styles.cohortData}>
                                <div>
                                    <img src={getImageUrl('blueCalendar.png')} alt="" />
                                    {format( new Date(cohort.start_date), 'MMMM')} - {format( new Date(cohort.end_date), 'MMMM')}
                                </div>
                                <div>
                                    <img src={getImageUrl('forStudents.png')} alt="" />
                                    {cohort.studentsNo} Students
                                </div>
                            </div>
                            <div className={styles.cohortLoader2}>
                                <p>{cohort.course.filter(e => e.completed === true).length}/{cohort.course.length}</p>
                                <progress
                                    id="progress"
                                    className={`${cohort.course.filter(e => e.completed === true).length === cohort.course.length ? styles.complete : ''} ${styles.progress}`}
                                    max={cohort.course.length}
                                    value={cohort.course.filter(e => e.completed === true).length}
                                />
                            </div>
                        </div>

                        {cohort.course.length < 1 ?
                            <p className={styles.loading}>No Courses under this Cohort</p>
                            :
                            <div>
                                <table className={styles.cohortTable}>
                                    <thead>
                                        <th><input type="checkbox" /></th>
                                        <th>Course Title</th>
                                        <th>No. Of Students</th>
                                        <th>No. of Lessons</th>
                                        <th>Action</th>
                                    </thead>
                                    <tbody>
                                        {currentCourses.map((cour, index) => (
                                            <tr key={index}>
                                                <td><input type="checkbox" /></td>
                                                <td>{cour.course_name}</td>
                                                <td>{cour.student_count}</td>
                                                <td>{cour.lesson_count}</td>
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
                                        currentData={cohort?.course}
                                        currentPage={currentPage}
                                        itemsPerPage={itemsPerPage}
                                        onPageChange={handlePageChange}
                                    />

                                </div>
                            </div>
                        }

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
                        <p>{cohort.cohort_name}</p>
                    </div>
                    <button onClick={()=>setIsOpenCourse(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>

                <form action={''} className={styles.contentBody}>
                    
                    <div className={styles.form}>
                        <label htmlFor="course">Course</label>
                        <select name="course" id="course">
                            <option value="">Select course</option>
                            {allCourses.map((cours, index) => (
                                <option key={index} value={cours.course_id}>{cours.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className={styles.flex}>
                        <div className={styles.form}>
                            <label htmlFor="title">Start Date</label>
                            <input type="text" name="start_date" id="start_date" value={format(new Date(cohort.start_date), 'MM/dd/yyyy')} />
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