import React, { useEffect, useRef, useState } from "react";
import styles from './AdminOverview.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";
// import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";


export const AdminOverview = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ lessonsLen, setLessonsLen ] = useState(0);
    const [ studentsLen, setStudentsLen ] = useState(0);
    const [ teachersLen, setTeachersLen ] = useState(0);
    const [ courses, setCourses ] = useState([]);
    const [ activities, setActivities ] = useState([]);

    const [ isTeachLoading, setIsTeachLoading ] = useState(false);
    const [ isCourseLoading, setIsCourseLoading ] = useState(false);
    const [ isStudLoading, setIsStudLoading ] = useState(false);
    const [ isLessLoading, setIsLessLoading ] = useState(false);
    const [ isActivityLoading, setIsActivityLoading ] = useState(false);

    const [ actionsOpen, setActionsOpen ] = useState({});
    
    const scroll = useRef(null);
    const actionsRef = useRef(null);
    

    useEffect(() => {
        fetchTeachersLength();
        fetchStudentsLength();
        fetchLessonsLength()
        fetchThreeCoursesTeachersStudents();
        fetchActivityLog();
    }, []);

    const fetchTeachersLength = async () => {
        setIsTeachLoading(true);
        try {
            const result = await axios(BASE_URL + "/teachers-len", {
                timeout: 20000
            });
            setTeachersLen(result.data);
            setIsTeachLoading(false);
        } catch (err) {
            console.log(err);
            setIsTeachLoading(false);
        }
    }
    const fetchStudentsLength = async () => {
        setIsStudLoading(true);
        try {
            if (sessionStorage.getItem('role') === 'Admin') {
                const result = await axios(BASE_URL + "/students-len", {
                    timeout: 20000
                });
                setStudentsLen(result.data);
            }
            else if (sessionStorage.getItem('role') === 'Teacher') {
                const result = await axios(BASE_URL + `/students-len/${sessionStorage.getItem('id')}`, {
                    timeout: 20000
                });
                setStudentsLen(result.data);
            }
            setIsStudLoading(false);
        } catch (err) {
            console.log(err);
            setIsStudLoading(false)
        }
    }
    const fetchLessonsLength = async () => {
        setIsLessLoading(true);
        try {
            if (sessionStorage.getItem('role') === 'Admin') {
                const result = await axios(BASE_URL + "/lessons-len", {
                    timeout: 20000
                });
                setLessonsLen(result.data);
            }
            else if (sessionStorage.getItem('role') === 'Teacher') {
                const result = await axios(BASE_URL + `/students-len/${sessionStorage.getItem('id')}`, {
                    timeout: 20000
                });
                setLessonsLen(result.data);
            }
            setIsLessLoading(false);
        } catch (err) {
            console.log(err);
            setIsLessLoading(false)
        }
    }

    const fetchThreeCoursesTeachersStudents = async () => {
        setIsCourseLoading(true);
        try {
            if (sessionStorage.getItem('role') === 'Admin') {
                const result = await axios(BASE_URL + "/courses-instructor-studentscount-lessons", {
                    timeout: 20000
                });
                setCourses(result.data.filter(e => e.is_active === true).slice(0,3));
            }
            else if (sessionStorage.getItem('role') === 'Teacher') {
                const result = await axios(BASE_URL + `/courses-instructor-studentscount-lessons/${sessionStorage.getItem('id')}`, {
                    timeout: 20000
                });
                setCourses(result.data.filter(e => e.is_active === true).slice(0,3));
            }
            setIsCourseLoading(false);
        } catch (err) {
            setIsCourseLoading(false);
            console.log(err);
        }
    }    

    const fetchActivityLog = async () => {
        setIsActivityLoading(true);
        try {
            if (sessionStorage.getItem('role') === 'Admin') {
                const result = await axios(BASE_URL + "/activity-log", {
                    timeout: 20000
                });
                setActivities(result.data);
            }
            else if (sessionStorage.getItem('role') === 'Teacher') {
                const result = await axios(BASE_URL + `/tasks/${sessionStorage.getItem('id')}`, {
                    timeout: 20000
                });
                setActivities(result.data);
            }
            setIsActivityLoading(false);
        } catch (err) {
            setIsActivityLoading(false);
            console.log(err);
        }
    }

    const toggleAction = (event, index) => {
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


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentActivities = activities.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageNumber = (itemNumber) => {
        setItemsPerPage(itemNumber);
        setCurrentPage(1);
        scroll.current.scrollIntoView();
    };


    function convertDuration(interval) {
        const result = { hours: 0, days: 0, months: 0 };

        if (interval === null) return result
        else {
            result.months = interval.months || 0;
            result.weeks = interval.weeks || 0;
            result.days = interval.days || 0;
            result.hours = interval.hours || 0;
        
            return result;
        }
    }
    

    return (
        <>
        <div className={styles.whole}>
            <a>Home</a>

            <div className={styles.overview}>
                <h5>Overview</h5>

                <div className={styles.overviews}>
                    
                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Total <br /> Lessons
                            <div className={styles.whiteBox}><img src={getImageUrl('assignment.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            {isLessLoading ? '...' : lessonsLen}
                        </div>
                    </div>

                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Total <br /> Students
                            <div className={styles.whiteBox}><img src={getImageUrl('forStudents.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            {isStudLoading ? '...' : studentsLen}
                        </div>
                    </div>

                    {sessionStorage.getItem('role') === 'Admin' && <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Total <br />Teachers
                            <div className={styles.whiteBox}><img src={getImageUrl('teachersIcon.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            {isTeachLoading ? '...' : teachersLen}
                         </div>
                    </div>}
                </div>

            </div>

            <div className={styles.courses}>
                <div className={styles.coursesHeader}>
                    Active Courses
                    <a href="/admin-dashboard/courses/active"><button>View All<img src={getImageUrl('greyRightAngle.png')} /></button></a>
                </div>

                {isCourseLoading ? <h5 className={styles.loading}>Loading...</h5> : 
                    
                    courses.length === 0 ?
                    
                        <p className={styles.none}>No Active Courses</p>
                        :
                        <div className={styles.flow}>
                    
                            {courses.sort((a,b) => new Date(b.date_added) - new Date(a.date_added)).slice(0,3).map((course, index) => (
                                <div className={styles.course} key={index}>
                                    <div className={styles.courseImage}>
                                        <img src={getImageUrl('frame7.png')} />
                                    </div>
                                    <div className={styles.courseInfo}>
                                        
                                        <h3>{course.course_name} {course.type && <span>{course.type}</span>}</h3>
                                            
                                        <p>{course.description}</p>

                                        <div style={{marginTop: 'auto', justifySelf: 'end'}}>
                                            <div className={styles.courseData}>
                                                <div>
                                                    <img src={getImageUrl('timer.png')} alt="" />
                                                    {course.duration === null ? 'N/A' : 
                                                        <>
                                                        {convertDuration(course.duration).months === 0 ? '' : convertDuration(course.duration).months + ' months '}
                                                        {convertDuration(course.duration).days === 0 ? '' : convertDuration(course.duration).days + ' days '}
                                                        {convertDuration(course.duration).hours === 0 ? '' : convertDuration(course.duration).hours + ' hours '}
                                                        </>
                                                    }
                                                </div>
        
                                                <div><img src={getImageUrl('frame5.png')} />{course.student_count} {course.student_count === 1 ? 'Student' : 'Students'}</div>
                                            </div>

                                            <progress className={styles.progress} id="progress" max={course.totalLessons} value={course.currentLesson} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }
            </div>

            {sessionStorage.getItem('role') === 'Admin' && <div className={styles.events}>
                <div className={styles.eventsHeader}>
                    Recent Activities
                    <a href="/admin-dashboard/activitylog"><button>View All<img src={getImageUrl('greyRightAngle.png')} /></button></a>
                </div>

                {isActivityLoading ? <h5 className={styles.loading}>Loading...</h5> :
                
                    currentActivities.length === 0 ?
                        
                        <p className={styles.none}>No Activities Found</p>
                        :
                        <>
                        <table className={styles.eventsTable} ref={scroll}>
                            <thead>
                                <th className={styles.checkbox}><input type="checkbox" /></th>
                                <th className={styles.activities}>Activities</th>
                                <th>Date and Time</th>
                                <th>Due Date</th>
                                <th className={styles.action}>Action</th>
                            </thead>
                            <tbody>
                                {currentActivities.map((act, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td className={styles.bread}>{act.activity}</td>
                                        <td>{format(new Date (act.date), 'MMMM dd, yyyy hh:mm a')}</td>
                                        <td>{act.dueDate}</td>
                                        <td><button className={styles.viewAll}>View All</button></td>
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
                                currentData={activities}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                            />

                        </div>
                        </>
                }
                
                
            </div>}


            {sessionStorage.getItem('role') === 'Teacher' && <div className={styles.events}>
                <div className={styles.eventsHeader}>
                    Recent Tasks
                    <a href="/admin-dashboard/tasks"><button>View All<img src={getImageUrl('greyRightAngle.png')} /></button></a>
                </div>

                {isActivityLoading ? <h5 className={styles.loading}>Loading...</h5> :
                
                    currentActivities.length === 0 ?
                        
                        <p className={styles.none}>No Tasks Found</p>
                        :
                        <>
                        <table className={styles.eventsTable} ref={scroll}>
                            <thead>
                                <th className={styles.checkbox}><input type="checkbox" /></th>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Task Title</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th className={styles.action}>Action</th>
                            </thead>
                            <tbody>
                                {currentActivities.map((task, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{task.student_name}</td>
                                        <td>{task.course_name}</td>
                                        <td>{task.name}</td>
                                        <td>{format(new Date(task.submitted_date), 'MMMM d, yyyy hh:mm:ss a')}</td>
                                        <td>
                                            <div className={task.graded === true ? styles.graded : styles.pending}>
                                                <div></div>
                                                {task.graded === true ? 'Graded' : 'Pending'}
                                            </div>
                                        </td>
                                        <td>
                                            <button className={styles.actionsButton} onClick={(e) => toggleAction(e, index)}>
                                                <img src={getImageUrl('threeDots.png')} alt="" />
                                            </button>
                                            {actionsOpen[index]&& <div className={styles.theActions} ref={actionsRef}>
                                                <h5>ACTION</h5>
                                                <button><img src={getImageUrl('edit.png')} />VIEW TASK</button>
                                                <button><img src={getImageUrl('approve.png')} />GRADE TASK</button>
                                                <button><img src={getImageUrl('approve.png')} />DOWNLOAD</button>
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
                                currentData={activities}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                            />

                        </div>
                        </>
                }
                
                
            </div>}
        </div>
        </>
    )
}