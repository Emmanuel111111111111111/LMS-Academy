import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./ActiveCourses.module.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from "../ActiveCourses/Modal";
import Pagination from "../../../Components/Pagination/Pagination";
import { BASE_URL, TEST_URL } from "../../../../config";

export const ActiveCourses = () => {

    const [ courses, setCourses ] = useState([]);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ openCreate, setOpenCreate ] = useState(false);
    const [ openCourseInfo, setOpenCourseInfo ] = useState(false);
    const [ openSuccess, setOpenSuccess ] = useState(false);
    const [ eventType, setEventType ] = useState("");
    const [ buttonType, setButtonType ] = useState("");
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ selected, setSelected ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(false);
    const actionsRef = useRef(null);
    const createRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoursesTeachersStudents();
    }, []);

    const fetchCoursesTeachersStudents = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/courses-instructor-studentscount-lessons", {
                timeout: 10000
            });
            setCourses(result.data.sort((a,b)=> new Date(b.date_added) - new Date(a.date_added)));
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setErrorMessage(true);
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


    const [ newCourseValues, setNewCourseValues ] = useState({
        name: '',
        type: '',
        duration_number: '',
        duration_unit: 'hour',
        duration: '',
        date: new Date().toISOString().slice(0,19).replace('T', ' '),
    })

    const handleDuration = (event) => {
        setNewCourseValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
        if (event.target.name === 'duration_unit') {
            setNewCourseValues(prev => ({ ...prev, duration: convertToStructuredDuration(event.target.value, newCourseValues.duration_number).intervalString }));
        } else if (event.target.name === 'duration_number') {
            setNewCourseValues(prev => ({ ...prev, duration: convertToStructuredDuration(newCourseValues.duration_unit, event.target.value).intervalString }));
        }
    }
    const handleInput = (event) => {
        setNewCourseValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    const handleSubmitCourse = async (event) => {
        event.preventDefault();
        setOpenCreate(false);
        console.log(newCourseValues);
        axios.post(BASE_URL + '/new-course', newCourseValues)
            .then(res => {
                console.log(res);
                handleSuccess('course');
            })
            .catch(err => console.log(err));
    }


    const handleSuccess = (type) => {
        setEventType(type);
        setOpenSuccess(true);
        setTimeout(() => setOpenSuccess(false), 3000);
        setTimeout(() => fetchCoursesTeachersStudents(), 3000);
    }
    const handleCloseCreate = () => {
        setOpenCreate(false);
    };
    const handleOpenCreate = (type) => {
        setButtonType(type);
        setOpenCreate(true);
    };

    const handleOpenCourse = (event, course) => {
        setSelected(course);
        setOpenCourseInfo(true);
    };
    const handleCloseCourseInfo = (index) => {
        setSelected(0)
        setOpenCourseInfo(false);
    };

    const handleEdit = (event, course) => {
        event.stopPropagation();
        navigate(`detail/${course.course_id}`, {state: course.course_id });
        window.scrollTo({ top: 0});
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
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
        if (createRef.current && !createRef.current.contains(event.target)) {
            setIsOpen(false);
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
    
            <div className={styles.breadcrumb}><a href="/admin-dashboard/courses">Courses</a> {'>'} Active</div>

            <div>
                <div className={styles.title}>
                    <h1>Active Courses</h1>
                    <div className={styles.buttons}>
                        <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                        <button className={styles.buttonTwo} onClick={toggleDropdown} ><img src={getImageUrl('whitePlus.png')} />Create Event</button>
                    </div>
                    {isOpen && (
                        <ul className={styles.createDiv} ref={createRef}>
                            <button onClick={() => handleOpenCreate("course")}><img src={getImageUrl('courseIcon.png')} />COURSE</button>
                            <button onClick={() => handleOpenCreate("assignment")}><img src={getImageUrl('assignments.png')} />ASSIGNMENTS</button>
                            <button onClick={() => handleOpenCreate("quiz")}><img src={getImageUrl('quizIcon.png')} />QUIZ</button>
                        </ul>
                    )}
                    <Modal isOpen={openCreate}>
                        <>
                        <div className={styles.course_modal}>
                            <div className={styles.head}>
                                <h3>{buttonType === "course" ? "Create Course" : buttonType === "assignment" ? "Create Assignment" : "Create Quiz"}</h3>
                                <button onClick={handleCloseCreate} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                            </div>

                            <form className={styles.theForm} onSubmit={buttonType === 'course' ? handleSubmitCourse : ''}>
                                <div>
                                    <h5>{buttonType === "course" ? "Course Name" : buttonType === "assignment" ? "Content title" : "Event Name"}</h5>
                                    <input type="text" name="name" placeholder="Enter Event Name" onChange={handleInput}/>
                                </div>
                                {buttonType === 'course' && <div>
                                    {/* <h5>{buttonType === "course" ? "Event Type" : buttonType === "assignment" ? "Duration" : "Event Type"}</h5> */}
                                    <h5>Course Type</h5>
                                    <select name="type" onChange={handleInput}>
                                        <option>Select Course Type</option>
                                        <option value="Online">Online</option>
                                        <option value="Physical">Physical</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>}

                                <h5>Duration</h5>
                                <div className={styles.duration}>
                                    <input type="number" name="duration_number" onChange={(e)=>handleDuration(e)} />

                                    <select name="duration_unit" onChange={(e)=>handleDuration(e)}>
                                        <option value="hour">Hours</option>
                                        <option value="day">Days</option>
                                        <option value="week">Weeks</option>
                                        <option value="month">Months</option>
                                    </select>
                                </div>
    
                                <button className={styles.submit}>Submit</button>

                            </form>
                            
                        </div>
                        </>
                    </Modal>
                </div>

                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :

                    courses.length === 0 ?
                                        
                    <p className={styles.none}>No Courses Found</p>
                    :
                    <div className={styles.course}>
                        
                        {courses.map((cour, index) => (
                            <div key={index} className={styles.courseInfo} onClick={(e) => handleOpenCourse(e, cour)} id="outer">
                                <div className={styles.courseImage}>
                                    <img src={getImageUrl('frame7.png')} />
                                </div>
                                <div className={styles.infoHeader}>
                                    <div><h3>{cour.name}<span>Started</span></h3></div>
                                    <div>
                                        <button className={styles.actionsButton} onClick={(e) => toggleAction(e, index)}><img src={getImageUrl('threeDots.png')} /></button>
                                        <div className={`${styles.actionsClosed} ${actionsOpen[index] && styles.theActions}`} ref={actionsRef}>
                                            <h5>ACTION</h5>
                                            <button onClick={(e)=>handleEdit(e, cour)}><img src={getImageUrl('edit.png')} />EDIT</button>
                                            <button onClick={(e)=>handleEdit(e, index)}><img src={getImageUrl('approve.png')} />SUSPEND</button>
                                            <button onClick={(e)=>handleEdit(e, index)}><img src={getImageUrl('delete.png')} />DECLINE</button>
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
                                        <div className={styles.profile}><img src={getImageUrl('profile.svg')} alt="" />{cour.instructors.length > 0 ? cour.instructors[0].name : 'None'}</div>
                                        <div className={styles.students}><img src={getImageUrl('frame5.png')} alt="" />{cour.student_count} {cour.student_count === 1 ? 'Student' : 'Students'}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>

        <Modal isOpen={openCourseInfo}>
            <>
            <div className={styles.courseInfo_modal}>
                <div className={styles.head}>
                    <h3>{buttonType === "COURSE" ? "Course Details" : buttonType === "ASSIGNMENTS" ? "Create Assignment" : "Course Details"}</h3>
                    <button onClick={handleCloseCourseInfo} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>
                <div style={{overflow: 'auto', display: 'flex',flexDirection: 'column'}}>
                    <p className={styles.texts}>Course details</p>
                    <hr className={styles.line}></hr>

                    <div className={styles.Modal}>
                        <div className={styles.Image}>
                            <img src={getImageUrl("Frm.png")} alt="g" />
                        </div>
                        <div className={styles.text}>
                            <div className={styles.Header}>
                                <div className={styles.crunb}><h3>{selected.name}<span>Started</span></h3></div>
                                <button><img src={getImageUrl('threeDots.png')} alt="" /></button>
                            </div>
                            <p>Lorem ipsum dolor sit amet consectetur.Feugia t blandit turpis. lorem ipsum dolor sit
                                amet consectetur. Feugia t blandit turpis...Lorem ipsum dolor sit amet consectetur. Feugia t blandit turpis.Lorem ipsum.
                            </p>
                            <div className={styles.coursesDatas}>
                                <div className={styles.bead}>
                                    <div className={styles.pro}><img src={getImageUrl('profile.svg')} alt="" />{selected.teacher}</div>
                                    <div className={styles.stud}><img src={getImageUrl('pic.png')} alt="" />{selected.students} Students</div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <table className={styles.coursetable}>
                        <thead>
                            <th><input type="checkbox" /></th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Phone Number</th>
                            <th>Email</th>
                            <th>Date</th>
                            <th>Action</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>Feranmi</td>
                                <td>Jones</td>
                                <td>+23490543322</td>
                                <td>FeranmiJ@gm...</td>
                                <td>Jones</td>
                                <td><button  className={styles.app}>Approve</button></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>Feranmi</td>
                                <td>Jones</td>
                                <td>+23490543322</td>
                                <td>FeranmiJ@gm...</td>
                                <td>Jones</td>
                                <td><button  className={styles.app}>Approve</button></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>Feranmi</td>
                                <td>Jones</td>
                                <td>+23490543322</td>
                                <td>FeranmiJ@gm...</td>
                                <td>Jones</td>
                                <td><button  className={styles.app}>Approve</button></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>Feranmi</td>
                                <td>Jones</td>
                                <td>+23490543322</td>
                                <td>FeranmiJ@gm...</td>
                                <td>Jones</td>
                                <td><button  className={styles.app}>Approve</button></td>
                            </tr>
                            <tr>
                                <td><input type="checkbox" /></td>
                                <td>Feranmi</td>
                                <td>Jones</td>
                                <td>+23490543322</td>
                                <td>FeranmiJ@gm...</td>
                                <td>Jones</td>
                                <td><button  className={styles.app}>Approve</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{w: "100%", display: "flex", alignItems: 'center'}}>
                        <div className={styles.showRows}>
                            Show
                            <select onChange={(e) => handlePageNumber(e.target.value)}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            </select>
                            Row
                        </div>
                        
                        {/* <Pagination className={styles.pag}
                                
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                        />        */}
                    </div>
                        
                    <button className={styles.yes}>Submit</button>
                </div>
                        
            </div>
            </>
        </Modal>

        <Modal isOpen={openSuccess}>
            <div className={styles.added}>
                {eventType} ADDED!
            </div>
        </Modal>


        </>
    )
}