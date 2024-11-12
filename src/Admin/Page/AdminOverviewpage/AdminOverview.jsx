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
    const [ studentsLen, setStudentsLen ] = useState(0);
    const [ teachersLen, setTeachersLen ] = useState(0);
    const [ courses, setCourses ] = useState([]);
    const [ activities, setActivities ] = useState([]);

    const [ isTeachLoading, setIsTeachLoading ] = useState(false);
    const [ isCourseLoading, setIsCourseLoading ] = useState(false);
    const [ isStudLoading, setIsStudLoading ] = useState(false);
    const [ isActivityLoading, setIsActivityLoading ] = useState(false);
    // const navigate = useNavigate();
    const scroll = useRef(null);

    useEffect(() => {
        fetchTeachersLength();
        fetchStudentsLength();
        fetchThreeCoursesTeachersStudents();
        fetchActivityLog();
    }, []);

    const fetchTeachersLength = async () => {
        setIsTeachLoading(true);
        try {
            const result = await axios(BASE_URL + "/teachers-len", {
                timeout: 10000
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
            const result = await axios(BASE_URL + "/students-len", {
                timeout: 10000
            });
            setStudentsLen(result.data);
            setIsStudLoading(false);
        } catch (err) {
            console.log(err);
            setIsStudLoading(false)
        }
    }

    const fetchThreeCoursesTeachersStudents = async () => {
        setIsCourseLoading(true);
        try {
            const result = await axios(BASE_URL + "/courses-instructor-studentscount", {
                timeout: 10000
            });
            setCourses(result.data.sort((a,b) => new Date(b.date_added) - new Date(a.date_added)).slice(0,3));
            setIsCourseLoading(false);
        } catch (err) {
            setIsCourseLoading(false);
            console.log(err);
        }
    }    

    const fetchActivityLog = async () => {
        setIsActivityLoading(true);
        try {
            const result = await axios(BASE_URL + "/activity-log", {
                timeout: 10000
            });
            setActivities(result.data.sort((a,b) => new Date(b.date) - new Date(a.date)));
            setIsActivityLoading(false);
        } catch (err) {
            setIsActivityLoading(false);
            console.log(err);
        }
    }


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
                            {isStudLoading ? '...' : '0'}
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

                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Total <br />Teachers
                            <div className={styles.whiteBox}><img src={getImageUrl('teachersIcon.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            {isTeachLoading ? '...' : teachersLen}
                         </div>
                    </div>
                </div>

            </div>

            <div className={styles.courses}>
                <div className={styles.coursesHeader}>
                    Active Courses
                    <a href="/admin-dashboard/courses/active"><button>View All<img src={getImageUrl('greyRightAngle.png')} /></button></a>
                </div>

                {isCourseLoading ? <h5 className={styles.loading}>Loading...</h5> : 
                    
                    courses.length === 0 ?
                    
                        <p className={styles.none}>No Courses Found</p>
                        :
                        <div className={styles.flow}>
                    
                            {courses.sort((a,b) => new Date(b.date_added) - new Date(a.date_added)).slice(0,3).map((course, index) => (
                                <div className={styles.course} key={index}>
                                    <div className={styles.courseImage}>
                                        <img src={getImageUrl('frame7.png')} />
                                    </div>
                                    <div className={styles.courseInfo}>
                                        
                                        <h3>{course.name} - <span>{course.type}</span></h3>
                                            
                                        <p>Lorem ipsum dolor sit amet consectetur. Feugia t blandit turpis.</p>

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

            <div className={styles.events}>
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
                
                
            </div>
        </div>
        </>
    )
}