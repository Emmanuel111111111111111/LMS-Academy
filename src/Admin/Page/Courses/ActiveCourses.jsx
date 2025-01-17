import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./Courses.module.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import Modal from "../../Components/Modals/Modal";
import { ConfirmModal } from "../../Components/Modals/ConfirmModal";
import Pagination from "../../../Components/Pagination/Pagination";
import { BASE_URL, TEST_URL } from "../../../../config";

export const ActiveCourses = () => {

    const [ courses, setCourses ] = useState([]);
    const [ openCourseInfo, setOpenCourseInfo ] = useState(false);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ selected, setSelected ] = useState({});
    const [ selectedStudents, setSelectedStudents ] = useState([]);
    const [ confirmType, setConfirmType ] = useState('');
    const [ isOpenConfirm, setIsOpenConfirm ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isLoading3, setIsLoading3 ] = useState(false);
    const [ isLoadingCourse, setIsLoadingCourse ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(false);
    
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ currentStudentPage, setCurrentStudentPage ] = useState(1);
    const [ coursesPerPage, setCoursesPerPage ] = useState(12);
    const [ studentsPerPage, setStudentsPerPage ] = useState(5);
    
    const actionsRef = useRef(null);
    const scroll = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoursesTeachersStudents();
    }, []);
    
    const fetchCoursesTeachersStudents = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/courses-instructor-studentscount-lessons", {
                timeout: 20000
            });
            setCourses(result.data.filter(e => e.is_active === true));
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setErrorMessage(true);
        }
    }

    const fetchStudentsForCourse = async (course_id) => {
        setIsLoadingCourse(true);
        try {
            const result = await axios(BASE_URL + `/students-for-course/${course_id}`, {
                timeout: 20000
            });
            setSelectedStudents(result.data);
            console.log(result.data);
            setIsLoadingCourse(false);
        } catch (err) {
            console.log(err);
            setIsLoadingCourse(false);
        }
    }

    function convertDuration(interval) {
        const result = { hours: 0, days: 0, months: 0 };

        if (interval === null) {
            return result;
        }
        else {
            result.months = interval.months || 0;
            result.weeks = interval.weeks || 0;
            result.days = interval.days || 0;
            result.hours = interval.hours || 0;
        
            return result;
        }
    }
    function convertToStructuredDuration(unit, number) {
        const daysInMonth = 30;
        const daysInWeek = 7;
        const hoursInDay = 24;
    
        var totalInputDays = 0;
        var remainingHours = 0;

        if (unit === 'day') totalInputDays = number;
        else if (unit === 'week') totalInputDays = (number * daysInWeek);
        else if (unit === 'hour') {
            totalInputDays = Math.floor(number / hoursInDay);
            remainingHours = number % hoursInDay;
        }
        const months = Math.floor(totalInputDays / daysInMonth);
        const remainingDaysAfterMonths = totalInputDays % daysInMonth;
    
        const weeks = Math.floor(remainingDaysAfterMonths / daysInWeek);
        const days = remainingDaysAfterMonths % daysInWeek;
    
        return {
            months,
            weeks,
            days,
            hours: remainingHours,
            intervalString: `${months} months, ${weeks} weeks, ${days} days, ${remainingHours} hours`
        };
    }



    const handleDuration = (event) => {
        setNewEventValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
        if (event.target.name === 'duration_unit') {
            setNewEventValues(prev => ({ ...prev, duration: convertToStructuredDuration(event.target.value, newEventValues.duration_number).intervalString }));
        } else if (event.target.name === 'duration_number') {
            setNewEventValues(prev => ({ ...prev, duration: convertToStructuredDuration(newEventValues.duration_unit, event.target.value).intervalString }));
        }
    }

    const handleOpenCourse = (event, course) => {
        setSelected(course);
        fetchStudentsForCourse(course.course_id);
        console.log(course)
        setOpenCourseInfo(true);
    };
    const handleCloseCourseInfo = (index) => {
        setSelected({})
        setOpenCourseInfo(false);
    };

    const handleEdit = (event, course) => {
        event.stopPropagation();
        navigate(`/admin-dashboard/courses/detail/${course.course_id}`, {state: course.course_id });
        window.scrollTo({ top: 0});
    }
    const handleRemove = async (student) => {
        setIsLoading3(true);
        const submitValues = ({
            student_id: student.student_id,
            student_name: student.first_name || '' || ' ' || student.last_name,
            course_id: selected.course_id,
            course_name: selected.course_name,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user: sessionStorage.getItem('full_name'),
        })
        console.log(submitValues);
        try {
            
            const response = await axios.post(BASE_URL + '/unenroll-student', submitValues);
            console.log(response);

            fetchStudentsForCourse(selected.course_id);
            fetchCoursesTeachersStudents();
            setIsLoading3(false);

        } catch (err) {
            console.log(err);
            setIsLoading3(false);
        }
    }

    const handleOpenConfirm = (event, theCourse, type) => {
        event.stopPropagation();
        setSelected(theCourse);
        setConfirmType(type);
        setIsOpenConfirm(true);
    }


    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

    const indexOfLastStudent = currentStudentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = selectedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const handleCoursePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0});
    };
    const handleStudentPageChange = (pageNumber) => {
        setCurrentStudentPage(pageNumber);
    };

    const handleCoursePageNumber = (itemNumber) => {
        setCoursesPerPage(itemNumber);
        setCurrentPage(1);
        window.scrollTo({ top: 0});
    };
    const handleStudentPageNumber = (itemNumber) => {
        setStudentsPerPage(itemNumber);
        setCurrentStudentPage(1);
        scroll.current.scrollIntoView();
    };

    const toggleAction = (event, index) => {
        console.log('hereeee')
        event.stopPropagation();
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

            <div className={styles.breadcrumb}><a href="/admin-dashboard/overview">Home</a> {'>'} <a href="/admin-dashboard/courses">Courses</a> {'>'} Active</div>

            <div>
                <div className={styles.title}>
                    <h1>Active Courses</h1>
                    <div className={styles.buttons}>
                        <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                    </div>
                </div>

                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :

                    courses.length === 0 ?
                                        
                    <p className={styles.none}>No Courses Found</p>
                    :
                    <div>
                        <div className={styles.course}>
                            
                            {currentCourses.map((cour, index) => (
                                <div key={index} className={styles.courseInfo} onClick={(e) => handleOpenCourse(e, cour)} id="outer">
                                    <div className={styles.courseImage}>
                                        <img src={getImageUrl('frame7.png')} />
                                    </div>
                                    <div className={styles.infoHeader}>
                                        <div><h3>{cour.course_name}</h3>{cour.suspended ? <span className={styles.susp}>Suspended</span> : ''}</div>
                                        <div>
                                            <button className={styles.actionsButton} onClick={(e) => toggleAction(e, index)}><img src={getImageUrl('threeDots.png')} /></button>
                                            <div className={`${styles.actionsClosed} ${actionsOpen[index] && styles.theActions}`} ref={actionsRef}>
                                                <h5>ACTION</h5>
                                                <button onClick={(e)=>handleEdit(e, cour)}><img src={getImageUrl('edit.png')} />EDIT</button>
                                                {!cour.suspended && <button onClick={(e)=>handleOpenConfirm(e, cour, 'suspend')}><img src={getImageUrl('approve.png')} />SUSPEND</button>}
                                                {cour.suspended && <button onClick={(e)=>handleOpenConfirm(e, cour, 'resume')}><img src={getImageUrl('approve.png')} />RESUME</button>}
                                                <button onClick={(e)=>handleOpenConfirm(e, cour, 'delete')}><img src={getImageUrl('delete.png')} />DELETE</button>
                                            </div>
                                        </div>
                                    </div>
                                    <p>{cour.description}</p>
                                    <div className={styles.courseData}>
                                        <div className={styles.bread}>
                                            {cour.duration != null && <div className={styles.profile}>
                                                <img src={getImageUrl('timer.png')} />
                                                {convertDuration(cour.duration).months === 0 ? '' : convertDuration(cour.duration).months + ' months '}
                                                {convertDuration(cour.duration).days === 0 ? '' : convertDuration(cour.duration).days + ' days '}
                                                {convertDuration(cour.duration).hours === 0 ? '' : convertDuration(cour.duration).hours + ' hours '}
                                            </div>}
                                        </div>
                                        <div className={styles.crumb}>
                                            {cour.instructors.length > 0 && <div className={styles.profile}><img src={getImageUrl('profile.svg')} alt="" />{cour.instructors[0].full_name}</div>}
                                            <div className={styles.students}><img src={getImageUrl('frame5.png')} alt="" />{cour.student_count} {cour.student_count === 1 ? 'Student' : 'Students'}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.bigPag}>
                            <div className={styles.showRows}>
                                Show
                                <select onChange={(e) => handleCoursePageNumber(e.target.value)} >
                                    <option value={12}>12</option>
                                    <option value={24}>24</option>
                                    <option value={36}>36</option>
                                </select>
                                Courses
                            </div>
                            <Pagination className={styles.pag}
                                currentData={courses}
                                currentPage={currentPage}
                                itemsPerPage={coursesPerPage}
                                onPageChange={handleCoursePageChange}
                            />

                        </div>
                    </div>
                }
            </div>
        </div>


        <Modal isOpen={openCourseInfo}>
            <div className={styles.courseInfo_modal}>
                
                <div className={styles.Modhead}>
                    <div>
                        <h3>Course Details</h3>
                        <button onClick={handleCloseCourseInfo} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                    </div>
                    <p className={styles.texts}>{selected.course_name}</p>
                </div>

                <div style={{overflow: 'auto', display: 'flex',flexDirection: 'column'}}>

                    <div className={styles.Modal}>
                        <img className={styles.modImg} src={getImageUrl("Frm.png")} alt="g" />
                        <div className={styles.text}>
                            <div className={styles.Header}>
                                <h3>
                                    {selected.course_name}
                                    {selected.suspended ? <span className={styles.susp}>Suspended</span> : selected.is_active ? <span>Started</span> : ''}
                                </h3>
                            </div>

                            <p>{selected.description}</p>

                            <div className={styles.coursesDatas}>
                                {selected.instructors?.length > 0 && <div className={styles.pro}>
                                    <img src={getImageUrl('profile.svg')} alt="" />
                                    {selected.instructors?.length > 0 && selected.instructors[0].full_name}
                                </div>}
                                <div className={styles.stud}>
                                    <img src={getImageUrl('forStudents.png')} alt="" />
                                    {selected.student_count} Student(s)
                                </div>
                            </div>
                        </div>
                    </div>
                    {isLoadingCourse ? 
                        <p className={styles.loading}>Loading...</p>
                    :
                    currentStudents.length < 1 ? 
                        <p className={styles.noStudents}>No students under this course yet</p>
                    :
                    <>
                        <table className={styles.coursetable} ref={scroll}>
                            <thead>
                                <th className={styles.check}><input type="checkbox" /></th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Date</th>
                                <th className={styles.act}>Action</th>
                            </thead>
                            <tbody>
                                {currentStudents.map((stud, ind) => (
                                    <tr key={ind}>
                                        <td><input type="checkbox" /></td>
                                        <td style={{color: '#171717'}}>{stud.first_name}</td>
                                        <td>{stud.last_name}</td>
                                        <td>{stud.phone_no}</td>
                                        <td>{stud.email}</td>
                                        <td>{format(new Date(stud.enrollment_date), 'MMMM dd, yyyy hh:mm')}</td>
                                        <td onClick={()=>handleRemove(stud)}><button className={styles.app}>{isLoading3 ? '...' : 'Remove'}</button></td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                        <div className={styles.bigPag}>
                            <div className={styles.showRows}>
                                Show
                                <select onChange={(e) => handleStudentPageNumber(e.target.value)}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                </select>
                                Rows
                            </div>
                            
                            <Pagination
                                className={styles.pag}
                                currentData={currentStudents}
                                currentPage={currentStudentPage}
                                itemsPerPage={studentsPerPage}
                                onPageChange={handleStudentPageChange}
                            />       
                        </div>
                    </>
                    }
                </div>
            </div>
        </Modal>

        <ConfirmModal isOpen={isOpenConfirm} setOpen={setIsOpenConfirm} item={'Course'} cohort={'none'} selected={selected} confirmType={confirmType} reload={fetchCoursesTeachersStudents} />

        </>
    )
}