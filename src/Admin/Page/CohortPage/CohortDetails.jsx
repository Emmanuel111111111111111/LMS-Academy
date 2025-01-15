import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./CohortPage.module.css";
import axios from 'axios';
import { format } from "date-fns";
import Modal from "../../Components/Modals/Modal";
import { useParams } from "react-router-dom";
import Pagination from "../../../Components/Pagination/Pagination";
import { BASE_URL, TEST_URL } from "../../../../config";
import { ConfirmModal } from "../../Components/Modals/ConfirmModal";

export const CohortDetails = () => {

    const { id } = useParams();

    const [ cohort, setCohort ] = useState({});
    const [ allCourses, setAllCourses ] = useState([]);
    const [ cohortCourses, setCohortCourses ] = useState([]);

    const [ isOpenCourse, setIsOpenCourse ] = useState(false);
    const [ dateError, setDateError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isLoading2, setIsLoading2 ] = useState(false);

    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ selected, setSelected ] = useState({});
    const [ confirmType, setConfirmType ] = useState('');
    const [ isOpenConfirm, setIsOpenConfirm ] = useState(false);
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
            const result = await axios(BASE_URL + `/cohorts-details/${id}`,
                {
                    timeout: 20000,
                }
            );
            if (result.data[0] === undefined || result.data[0] === null) {
                window.location.href = "/admin-dashboard/cohort";
            } else {
                setCohort(result.data[0]);
                setCohortCourses(result.data[0].course);
                setIsLoading(false);
            }
        } catch (err) {
            console.log(err);
            window.location.pathname === "/admin-dashboard/cohort"
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



    const [ addedCourseValues, setAddedCourseValues ] = useState({
        cohort_id: '',
        cohort_name: '',
        course_id: 0,
        course_name: 0,
        end_date: '',
        date_added: new Date().toISOString().slice(0, 19).replace('T', ' '),
        user: sessionStorage.getItem('full_name'),
    })

    const handleInput = (event) => {
        setDateError(false);
        if ((event.target.name === 'end_date' && event.target.value < cohort.start_date)
            || (event.target.name === 'end_date' && event.target.value > cohort.end_date)) {
            console.log('before');
            setDateError(true);
            return
        }
        else if (event.target.name === 'course_id') {
            const nameId = event.target.value.split('-');
            setAddedCourseValues(prev => ({ ...prev, 'course_id': nameId[0] }));
            setAddedCourseValues(prev => ({ ...prev, 'course_name': nameId[1] }));
        }
        else {
            setAddedCourseValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
        }
        setAddedCourseValues(prev => ({ ...prev, 'cohort_id': cohort.cohort_id }));
        setAddedCourseValues(prev => ({ ...prev, 'cohort_name': cohort.cohort_name }));
    }

    const submitNewCourse = async (event) => {
        event.preventDefault();
        setIsLoading2(true);
        try {
            const response = await axios.post(BASE_URL + '/new-cohort-course', addedCourseValues);
            console.log(response);

            setIsOpenCourse(false);
            // handleSuccess();
            fetchCohortData();
            setIsLoading2(false);
            console.log("added.")
            
        } catch (err) {
            console.log(err);
            setIsLoading2(false);
        }
    }

    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = cohortCourses.slice(indexOfFirstItem, indexOfLastItem);

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


    const toCourseDetail = (id) => {
        window.location.href = `/admin-dashboard/courses/detail/${id}`;
    }
    const handleOpenConfirm = (theCourse, type) => {
        setSelected(theCourse);
        setConfirmType(type);
        setIsOpenConfirm(true);
    }



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
                                    {cohort.course.reduce((sum, item) => sum + item.student_count, 0)} Students
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
                                        <th>No. of Classes</th>
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
                                                    {actionsOpen[index] && <div className={styles.theActions} ref={actionsRef}>
                                                        <h5>ACTION</h5>
                                                        <button onClick={()=>toCourseDetail(cour.course_id)}><img src={getImageUrl('edit.png')} />EDIT</button>
                                                        <button onClick={()=>handleOpenConfirm(cour, 'suspend')}><img src={getImageUrl('approve.png')} />SUSPEND</button>
                                                        <button onClick={()=>handleOpenConfirm(cour, 'remove')}><img src={getImageUrl('delete.png')} />REMOVE</button>
                                                    </div>}
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

                <form onSubmit={submitNewCourse} className={styles.contentBody}>
                    
                    <div className={styles.form}>
                        <label htmlFor="course">Course</label>
                        <select name="course_id" id="course_id" onInput={handleInput} required>
                            <option value="">Select course</option>
                            {allCourses.map((cours, index) => (
                                <option key={index} value={cours.course_id + '-' + cours.name}>{cours.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* <div className={styles.flex}>
                        <div className={styles.form}>
                            <label htmlFor="title">Start Date</label>
                            <input type="text" name="start_date" id="start_date" value={cohort.start_date ? format(new Date(cohort.start_date), 'MM/dd/yyyy'): ''} readOnly  />
                        </div>

                        <div className={styles.form}>
                            <label htmlFor="title">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                id="end_date"
                                placeholder="Enter cohort title"
                                onInput={handleInput}
                                min={cohort.start_date}
                                required />
                        </div>                        
                    </div> */}
                    {/* <p style={{marginTop: '-12px', color: 'red'}}>{dateError && "End date must be after start date"}</p>                     */}

                    <button className={styles.cohortButton} type="submit">{isLoading2 ? "..." : "Submit"}</button>

                </form>


            </div>
        </Modal>

        <ConfirmModal isOpen={isOpenConfirm} setOpen={setIsOpenConfirm} item={'Course'} cohort={cohort} selected={selected} confirmType={confirmType} reload={fetchCohortData} />
        </>
    )
}