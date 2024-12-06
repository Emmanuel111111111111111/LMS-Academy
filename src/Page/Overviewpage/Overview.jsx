import React, { useEffect, useRef, useState } from "react";
import styles from './Overview.module.css';
import { getImageUrl } from "../../utilis";
import Pagination from "../../Components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";

export const Overview = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ name, setName ] = useState("");
    const [ id, setId ] = useState("");
    const [ completedLess, setCompletedLess ] = useState(0);
    const [ dueLess, setDueLess ] = useState(0);
    const [ dueAssign, setDueAssign ] = useState(0);

    const [ loadingCL, setLoadingCL ] = useState(false);
    const [ loadingDL, setLoadingDL ] = useState(false);
    const [ loadingDA, setLoadingDA ] = useState(false);

    const navigate = useNavigate();
    const scroll = useRef(null);

    useEffect(() => {
        console.log(sessionStorage);
        setName(sessionStorage.getItem("first_name"));
        setId(sessionStorage.getItem("id"));
    }, []);

    useEffect(() => {
        fetchLessons()
    })

    const fetchLessons = async () => {
        setLoadingCL(true);
        setLoadingDL(true);
        setLoadingDA(true);
        try {
            const result = await axios(TEST_URL + "/lessons/", {
                timeout: 10000
            });
            // setLessonsLen(result.data);
            // setIsLessLoading(false);
        } catch (err) {
            console.log(err);
            // setIsLessLoading(false)
        }
    }



    const courses = [
        {
            title: 'Course Title 1',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 7,
            totalLessons: 12,
            currentAssignment: 6,
            time: '7h 25m'
        },
        {
            title: 'Course Title 2',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 16,
            totalLessons: 30,
            currentAssignment: 7,
            time: '7h 25m'
        },
        {
            title: 'Course Title 3',
            description: 'A short lesson description...',
            teacher: 'Arafat Murad',
            currentLesson: 7,
            totalLessons: 12,
            currentAssignment: 5,
            time: '7h 25m'
        }
    ]

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

    return (
        <>
        <div className={styles.whole}>
            <a>Home</a>

            <div className={styles.welcomeBanner}>
                <div className={styles.left}>
                    <img src={getImageUrl('profile.svg')} />
                    <div className={styles.text}>
                        <h3>Welcome Back,</h3>
                        <h2>{name}</h2>
                    </div>
                </div>
                <button>Edit Profile</button>
            </div>

            <div className={styles.overview}>
                <h5>Overview</h5>
                <div className={styles.overviews}>
                    
                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Total Completed Lessons
                            <div className={styles.blueBox}><img src={getImageUrl('completed.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            5/8
                            <progress className={styles.progress} id="progress" value={5} max={8} />
                        </div>
                    </div>

                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Lessons Due
                            <div className={styles.blueBox}><img src={getImageUrl('instructors.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            3/12
                            <progress className={styles.progress} id="progress" value={3} max={12} />
                        </div>
                    </div>

                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Assignments Due
                            <div className={styles.blueBox}><img src={getImageUrl('assignment.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            4/6
                            <progress className={styles.progress} id="progress" value={4} max={6} />
                        </div>
                    </div>
                </div>

            </div>

            <div className={styles.courses}>
                <div className={styles.coursesHeader}>
                    Active Courses
                    <button onClick={()=>navigate('/dashboard/courses/active')}>View All <img src={getImageUrl('greyRightAngle.png')} alt="" /></button>
                </div>
                {courses.slice(0,2).map((course, index) => (
                    <div className={styles.course} key={index}>
                        <div className={styles.courseImage}>
                            <img src={getImageUrl('course_image.png')} />
                        </div>
                        <div className={styles.courseInfo}>
                            <div className={styles.infoHeader}>
                                <h3>{course.title}</h3>
                                <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                            </div>
                            <p>{course.description}</p>
                            <div className={styles.courseData}>
                                <div className={styles.profile}><img src={getImageUrl('profile.svg')} alt="" />{course.teacher}</div>
                                <div><img src={getImageUrl('instructors.png')} alt="" />Lesson {course.currentLesson}</div>
                                <div><img src={getImageUrl('assignment.png')} alt="" />Assignment {course.currentAssignment}</div>
                                <div><img src={getImageUrl('timer.png')} alt="" />{course.time}</div>
                            </div>
                            <div className={styles.withLoader}>
                                <div className={styles.coursesLoader}>
                                    {course.currentLesson}/{course.totalLessons} Modules
                                    <progress className={styles.progress} id="progress" max={course.totalLessons} value={course.currentLesson} />
                                </div>
                                <button>Continue Course</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.events}>
                <div className={styles.eventsHeader}>
                    Upcoming Events
                    <button>View All<img src={getImageUrl('greyRightAngle.png')} alt="" /></button>
                </div>
                
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
                                <td>{event.courseName} ... <span>{event.eventType}</span></td>
                                <td><div className={styles.dueTime}><img src={getImageUrl('timer.png')} />{event.dueTime}</div></td>
                                <td>{event.dueDate}</td>
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