import React, { useEffect, useRef, useState } from "react";
import styles from './AdminOverview.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";


export const AdminOverview = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ teachers, setTeachers ] = useState([]);
    const [ courses, setCourses ] = useState([]);
    const [ students, setStudents ] = useState([]);
    const [ isTeachLoading, setIsTeachLoading ] = useState(false);
    const [ isCourseLoading, setIsCourseLoading ] = useState(false);
    const [ isStudLoading, setIsStudLoading ] = useState(false);
    const navigate = useNavigate();
    const scroll = useRef(null);

    useEffect(() => {
        fetchTeachers();
        fetchCourses();
        fetchStudents();
    }, []);

    const fetchTeachers = async () => {
        setIsTeachLoading(true);
        try {
            const result = await axios(BASE_URL + "/teachers");
            setTeachers(result.data);
            // console.log(result.data);
            setIsTeachLoading(false);
        } catch (err) {
            console.log(err);
            // isTeachLoading(false);
        }
    }

    const fetchCourses = async () => {
        setIsCourseLoading(true);
        try {
            const result = await axios(BASE_URL + "/courses");
            setCourses(result.data);
            console.log(result.data);
            setIsCourseLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const fetchStudents = async () => {
        setIsStudLoading(true);
        try {
            const result = await axios(BASE_URL + "/students");
            setStudents(result.data);
            setIsStudLoading(false);
        } catch (err) {
            console.log(err);
        }
    }


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
        // window.scrollTo({ top: 50});
    };


    function convertDuration(interval) {
        if (interval === null) return '0 days'
        else {
            // console.log(interval)
            const result = {
                hours: 0,
                days: 0,
                months: 0,
            };

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
                            <div className={styles.blueBox}><img src={getImageUrl('frame10.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            100
                        </div>
                    </div>

                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Total <br /> Students
                            <div className={styles.blueBox}><img src={getImageUrl('frame9.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            {isStudLoading ? '...' : students.length}
                        </div>
                    </div>

                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Total <br />Teachers
                            <div className={styles.blueBox}><img src={getImageUrl('frame8.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            {isTeachLoading ? '...' : teachers.length}
                         </div>
                    </div>
                </div>

            </div>

            <div className={styles.courses}>
                <div className={styles.coursesHeader}>
                    Active Courses
                   
                </div>
                <div className={styles.flow}>
                    {isCourseLoading ? <h5>Loading...</h5> : 
                        courses.sort((a,b) => new Date(b.date_added) - new Date(a.date_added)).slice(0,3).map((course, index) => (
                            <div className={styles.course} key={index}>
                                <div className={styles.courseImage}>
                                    <img src={getImageUrl('frame7.png')} />
                                </div>
                                <div className={styles.courseInfo}>
                                    <div className={styles.infoHeader}>
                                        <h3>{course.name} - <span>{course.type}</span></h3>
                                        
                                    </div>
                                    <p>Lorem ipsum dolor sit amet consectetur. Feugia t blandit turpis.</p>
                                    <div className={styles.courseData}>
                                        <div>
                                            <img src={getImageUrl('timer.png')} alt="" />
                                            {convertDuration(course.duration).months === 0 ? '' : convertDuration(course.duration).months + ' months '}
                                            {convertDuration(course.duration).days === 0 ? '' : convertDuration(course.duration).days + ' days '}
                                            {convertDuration(course.duration).hours === 0 ? '' : convertDuration(course.duration).hours + ' hours '}
                                        </div>
                                        <div><img src={getImageUrl('frame5.png')} alt="" />54 Students</div>
                                    </div>

                                    <progress className={styles.progress} id="progress" max={course.totalLessons} value={course.currentLesson} />

                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className={styles.events}>
                <div className={styles.eventsHeader}>
                    Recent Activities
                    <button>View All<img src={getImageUrl('greyRightAngle.png')} alt="" /></button>
                </div>
                
                <table className={styles.eventsTable} ref={scroll}>
                    <thead>
                        <th><input type="checkbox" /></th>
                        <th>Activities</th>
                        <th>Time and Date</th>
                        <th>Due Date</th>
                        <th>Action</th>
                    </thead>
                    <tbody>
                        {currentEvents.map((event, index) => (
                            <tr key={index}>
                                <td><input type="checkbox" /></td>
                                <td> <div className={styles.bread}>You created a new teacher fo...</div></td>
                                <td><div className={styles.dueTime}>July 1, 2024 12:38:00 PM</div></td>
                                <td><div className={styles.crumb}>{event.dueDate}</div></td>
                                <td><button><img src={getImageUrl('View.png')} /></button></td>
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
                        currentData={events}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />

                </div>
                
                
            </div>
        </div>
        </>
    )
}