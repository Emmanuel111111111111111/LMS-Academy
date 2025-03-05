import React, { useEffect, useRef, useState } from "react";
import styles from './Overview.module.css';
import { getImageUrl } from "../../utilis";
import Pagination from "../../Components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { format } from 'date-fns';
import { BASE_URL, TEST_URL } from "../../../config";
import { customToast } from "../../Components/Notifications.jsx";

export const Overview = () => {

    const [ name, setName ] = useState("");

    const [ allLess, setAllLess ] = useState([]);
    const [ completedLess, setCompletedLess ] = useState([]);
    const [ dueLess, setDueLess ] = useState([]);
    const [ allAssign, setAllAssign ] = useState([]);
    const [ dueAssign, setDueAssign ] = useState([]);
    const [ courses, setCourses ] = useState([]);
    const [ events, setEvents ] = useState([]);

    const [ loadingCL, setLoadingCL ] = useState(false);
    const [ loadingDL, setLoadingDL ] = useState(false);
    const [ loadingDA, setLoadingDA ] = useState(false);
    const [ loadingCourse, setLoadingCourse ] = useState(false);
    const [ loadingEvents, setLoadingEvents ] = useState(false);

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const navigate = useNavigate();
    const scroll = useRef(null);

    useEffect(() => {
        fetchLessonsAndAssignmets();
        // fetchAssignments();
        fetchEvents();
        fetchCoursesTeachersStudents();

    }, []);


    const fetchLessonsAndAssignmets = async () => {
        setLoadingCL(true);
        setLoadingDL(true);
        setLoadingDA(true);
        try {
            const result = await axios(BASE_URL + `/lessons/${sessionStorage.getItem("id")}`, {
                timeout: 10000
            });
            setAllLess(result.data);

            setCompletedLess(result.data.filter(e => e.completed === true));
            setLoadingCL(false);

            setDueLess(result.data.filter(e => e.completed === false));
            setLoadingDL(false);

            setAllAssign(result.data.filter(e => e.assignments.length > 0));
            setDueAssign(result.data.filter(e => e.completed === false).filter(e => e.assignments.length > 0));
            setLoadingDA(false);
        } catch (err) {
            console.log(err);
            customToast("We're having trouble fetching your lessons. Please try again later.")
            setLoadingCL(false);
            setLoadingDL(false);
            setLoadingDA(false);
        }
    }

    const fetchCoursesTeachersStudents = async () => {
        setLoadingCourse(true);
        try {
            const result = await axios(BASE_URL + `/courses-instructor-students-lessons/${sessionStorage.getItem("id")}`);
            setCourses(result.data.filter(e => e.is_active === true));
            setLoadingCourse(false);
        } catch (err) {
            console.log(err);
            customToast("We're having trouble fetching your courses. Please try again later.")
            setLoadingCourse(false);
        }
    }

    const fetchEvents = async () => {
        setLoadingEvents(true);
        try {
            const result = await axios(BASE_URL + `/events/${sessionStorage.getItem("id")}`, {
                timeout: 25000
            });
            setEvents(result.data.filter(e => e.completed === false));
            setLoadingEvents(false);
        } catch (err) {
            console.log(err);
            customToast("We're having trouble fetching your events. Please try again later.")
            setLoadingEvents(false);
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


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageNumber = (itemNumber) => {
        setItemsPerPage(itemNumber);
        setCurrentPage(1);
        scroll.current.scrollIntoView();
    };

    const toProfilePage = () => {
        window.location.href = "/dashboard/profile";
    }
    const toEventsPage = () => {
        window.location.href = "/dashboard/calendar";
    }
    const toCoursesPage = () => {
        window.location.href = "/dashboard/courses";
    }
    const goToCourse = (id) => {
        window.location.href = `/dashboard/courses/detail/${id}`;
    }

    return (
        <>
        <div className={styles.whole}>
            <a>Home</a>

            <div className={styles.welcomeBanner}>
                <div className={styles.left}>
                    <img src={getImageUrl('profile.svg')} />
                    <div className={styles.text}>
                        <h3>Welcome Back,</h3>
                        <h2>{sessionStorage.getItem("first_name")}</h2>
                    </div>
                </div>
                <button onClick={toProfilePage}>Edit Profile</button>
            </div>

            <div className={styles.overview}>
                <h5>Overview</h5>
                <div className={styles.overviews}>
                    
                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Total Completed Lessons
                            <div className={styles.blueBox}><img src={getImageUrl('completed.svg')} /></div>
                        </div>
                        <div className={styles.loader}>
                            {loadingCL ? '...' :
                            completedLess.length + '/' + allLess.length}
                            <progress className={styles.progress} id="progress" value={completedLess.length} max={allLess.length} />
                        </div>
                    </div>

                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Lessons Due
                            <div className={styles.blueBox}><img src={getImageUrl('instructors.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            {loadingCL ? '...' :
                            dueLess.length + '/' + allLess.length}
                            <progress className={styles.progress} id="progress" value={dueLess.length} max={allLess.length} />
                        </div>
                    </div>

                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Assignments Due
                            <div className={styles.blueBox}><img src={getImageUrl('assignment.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            {loadingCL ? '...' :
                            dueAssign.length + '/' + allAssign.length}
                            <progress className={styles.progress} id="progress" value={dueAssign.length} max={allAssign.length} />
                        </div>
                    </div>
                </div>

            </div>

            <div className={styles.courses}>
                <div className={styles.coursesHeader}>
                    Active Courses
                    <button onClick={toCoursesPage}>View All <img src={getImageUrl('greyRightAngle.png')} alt="" /></button>
                </div>
                {courses.length < 1 ? (
                    <h4 className={styles.loading}>NO ACTIVE COURSES</h4>
                ) : (
                    courses.slice(0,2).map((course, index) => (
                        <div className={styles.course} key={index}>
                            <div className={styles.courseImage}>
                                <img src={getImageUrl('course_image.png')} />
                            </div>
                            <div className={styles.courseInfo}>
                                <div className={styles.infoHeader}>
                                    <h3>{course.course_name}</h3>
                                    <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                                </div>
                                <p>{course.description}</p>
                                <div className={styles.courseData}>
                                    <div className={styles.profile}><img src={getImageUrl('profile.svg')} alt="" />{course.instructors[0].full_name}</div>
                                    {course.lessons.length > 0 && <div><img src={getImageUrl('instructors.png')} alt="" />Lesson {Math.min(...course.lessons.filter(e => e.completed === false).map(e => e.number))}</div>}
                                    {/* <div><img src={getImageUrl('assignment.png')} alt="" />Assignment {course.currentAssignment}</div> */}
                                    {course.duration != null && <div>
                                        <img src={getImageUrl('timer.png')} />
                                        {convertDuration(course.duration).months === 0 ? '' : convertDuration(course.duration).months + ' months '}
                                        {convertDuration(course.duration).days === 0 ? '' : convertDuration(course.duration).days + ' days '}
                                        {convertDuration(course.duration).hours === 0 ? '' : convertDuration(course.duration).hours + ' hours '}
                                    </div>}
                                </div>
                                <div className={styles.withLoader}>
                                    <div className={styles.coursesLoader}>
                                        {course.lessons.filter(e => e.completed).length}/{course.lessons.length} Lessons
                                        <progress className={styles.progress} id="progress" max={course.lessons.length} value={course.lessons.filter(e => e.completed).length} />
                                    </div>
                                    <button onClick={()=>goToCourse(course.course_id)}>Continue Course</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                
            </div>

            <div className={styles.events}>
                <div className={styles.eventsHeader}>
                    Upcoming Events
                    <button onClick={toEventsPage}>View All<img src={getImageUrl('greyRightAngle.png')} alt="" /></button>
                </div>

                {loadingEvents ? <p className={styles.loading}>Loading...</p>
                :
                currentEvents.length < 1 ? <h4 className={styles.none}>NO UPCOMING EVENTS</h4>
                :
                <>           
                    <table className={styles.eventsTable} ref={scroll}>
                        <thead>
                            <th><input type="checkbox" /></th>
                            <th>Event Name</th>
                            <th>Due Time</th>
                            <th>Due Date</th>
                            <th>Action</th>
                        </thead>
                        <tbody>
                            {currentEvents.map((event, index) => (
                                <tr key={index}>
                                    <td><input type="checkbox" /></td>
                                    <td>{event.course_name} ... <span>{event.event_type}</span></td>
                                    <td><div className={styles.dueTime}><img src={getImageUrl('timer.png')} />{format(new Date(event.start), 'hh:mm a')}</div></td>
                                    <td className={new Date(event.start) <= new Date() && styles.dueDate}>{format(new Date(event.start), 'MMMM d, yyyy')}</td>
                                    <td><button><img src={getImageUrl('threeDots.png')} /></button></td>
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
                        
                        <Pagination
                            className={styles.pag}
                            currentData={events}
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