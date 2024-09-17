import React, { useRef, useState } from "react";
import styles from './AdminOverview.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";
import { useNavigate } from "react-router-dom";

export const AdminOverview = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const navigate = useNavigate();
    const scroll = useRef(null);


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

            {/* <div className={styles.welcomeBanner}>
                <div className={styles.left}>
                    <img src={getImageUrl('avatar.png')} />
                    <div className={styles.text}>
                        <h3>Welcome Back</h3>
                        <h2>Toluwani</h2>
                    </div>
                </div>
                <button>Edit Profile</button>
            </div> */}

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
                            124
                        </div>
                    </div>

                    <div className={styles.eachOverview}>
                        <div className={styles.overviewText}>
                            Total <br />Teachers
                            <div className={styles.blueBox}><img src={getImageUrl('frame8.png')} /></div>
                        </div>
                        <div className={styles.loader}>
                            52
                         </div>
                    </div>
                </div>

            </div>

            <div className={styles.courses}>
                <div className={styles.coursesHeader}>
                    Active Courses
                   
                </div>
                <div className={styles.flow}>
                {courses.slice(0,3).map((course, index) => (
                    <div className={styles.course} key={index}>
                        <div className={styles.courseImage}>
                            <img src={getImageUrl('frame7.png')} />
                        </div>
                        <div className={styles.courseInfo}>
                            <div className={styles.infoHeader}>
                                <h3>Advertisement - <span>Online</span></h3>
                                
                            </div>
                            <p>Lorem ipsum dolor sit amet consectetur. Feugia t blandit turpis.</p>
                            <div className={styles.courseData}>
                                <div><img src={getImageUrl('timer.png')} alt="" />1 hr 25 Mins</div>
                                <div><img src={getImageUrl('frame5.png')} alt="" />54 Students</div>

                            </div>
                            <div className={styles.withLoader}>
                                <div className={styles.coursesLoader}>
                                    <progress className={styles.progress} id="progress" max={course.totalLessons} value={course.currentLesson} />
                                </div>
                                
                            </div>
                            </div>

                    
                        </div>
                    
                ))}
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
                            <tr>
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