import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./CourseDetail.module.css";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";
import Modal from "../../Components/Modals/Modal";
import Calendar from "react-calendar";
import "../../../App.css";


export const CourseDetail = () => {

    const {courseId} = useParams();
    const [ course, setCourse ] = useState([]);
    const [ charCount, setCharCount ] = useState(course?.description != null ? (255 - course.description.length) : 255);
    const [ isLoading, setIsLoading ] = useState(false);
    
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ isOpenClass, setIsOpenClass ] = useState(false);
    const [ newLessonTitle, setNewLessonTitle ] = useState('');
    const [ titleErrorMsg, setTitleErrorMsg ] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const actionsRef = useRef(null);


    useEffect(() => {
        loadCourseDetails();
    }, [])

    const loadCourseDetails = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/courses-instructor-studentscount-lessons`);
            console.log(result.data.filter(e => e.course_id === parseInt(courseId))[0]);
            setCourse(result.data.filter(e => e.course_id === parseInt(courseId))[0]);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            // setErrorMessage(true);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourse((prevCourse) => ({
            ...prevCourse,
            [name]: value,
        }));

        if (name === 'description') {
            setCharCount(255 - value.length);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(BASE_URL + `/courses/detail/${course.course_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(course),
            });

            if (response.ok) {
                console.log('Course updated successfully');
                loadCourseDetails();
                // navigate('/admin-dashboard/courses');
            } else {
                console.error("Failed to update course");
            }
        } catch (error) {
            console.log('Error updating course:', error);
        }
    };

    const handleCancel = () => {
        setCourse(location.state);
        navigate('/admin-dashboard/courses');
        // loadCourseDetails();
    }


    const handleNewLesson = async (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        if (!newLessonTitle.trim()) {
            setTitleErrorMsg(true);
            return;
        }

        const newLesson = { newLessonTitle, course_id: course.course_id };
        console.log(newLesson);
    
        try {
            const response = await fetch(BASE_URL + '/new-lesson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLesson),
            });
    
            if (response.ok) {
                setIsOpenClass(false);
                loadCourseDetails();
                alert('Lesson added successfully');
            } else {
                alert('Failed to add lesson');
            }
        } catch (error) {
            console.error('Error adding lesson:', error);
            alert('Error adding lesson');
        }
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
    };
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);


    return(
        <>        
        {isLoading ? <p className={styles.loading}>Loading...</p> :

        <form className={styles.whole} onSubmit={handleSubmit}>

            <div className={styles.breadcrumb}><a href="/admin-dashboard/courses">Courses</a> {'>'} {course.name}</div>

            <div className={styles.courseTitle}>
                <h3>{course.name}</h3>
                <div className={styles.buttons}>
                    <button className={styles.buttonOne} onClick={handleCancel} type="button">Cancel</button>
                    <button className={styles.buttonTwo} type="submit">Save</button>
                </div>
            </div>
            
            <div className={styles.grid}>
                <div className={styles.larger}>

                    <div className={styles.box}>
                        <div className={styles.header}>
                            <h5>Basic Info</h5>
                            <p>Provide information about the course</p>
                        </div>
                        <div className={styles.detailForm}>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" value={course.name} onChange={handleInputChange}/>

                            <label htmlFor="description">Description</label>
                            <textarea style={{width: '100%', height: '100px'}} type="text" name="description" id="" value={course.description} onChange={handleInputChange}/>
                            <p>{charCount} characters left</p>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.header}>
                            <h5>Upload files</h5>
                            <p>Select and upload the files of your choice</p>
                        </div>
                        <div className={styles.uploadBox}>
                            <div htmlFor="files">
                                <img src={getImageUrl('uploadDocs.png')} />
                                <h5>Choose a file or drag & drop it here</h5>
                                <p>JPEG, PNG, and PDF formats, up to 50MB</p>

                                <label className={styles.uploadButton}>
                                    Browse Files
                                    <input type="file" accept="image/png, image/jpeg, application/pdf" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.flexHeader}>
                            <h5>Classes</h5>
                            <button type="button" onClick={()=>setIsOpenClass(true)}>+ Add new class</button>
                        </div>
                        {course.lessons && course.lessons.map((cla, i) => (
                            <div className={styles.section} key={i}>
                                <div className={styles.text}>
                                    <img src={getImageUrl('reorder.png')} alt="" />
                                    Week {cla.week} - Beginner - {cla.title}
                                </div>
                                <div>
                                    <button type="button" className={styles.actionButton} onClick={(e) => toggleAction(e, i)}>
                                        <img src={getImageUrl('threeDots.png')} />
                                    </button>
                                    {actionsOpen[i] && <div className={styles.theActions} ref={actionsRef}>
                                        <h6>ACTION</h6>
                                        <button><img src={getImageUrl('edit.png')} />EDIT</button>
                                        <button><img src={getImageUrl('delete.png')} />DELETE</button>
                                    </div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>



                <div className={styles.smaller}>

                    <div className={styles.preview}>
                        <div>
                            <h5>Preview Course</h5>
                            <p>View how others see your course</p>
                        </div>
                        <button type="button">Preview</button>
                    </div>

                    <div className={styles.box}>
                        <div className={styles.photoForm} >
                            <div htmlFor="files">
                                <img src={getImageUrl('uploadPic.png')} />
                                <h5>Upload Cover Picture</h5>
                                <p>JPEG or PNG</p>

                                <label className={styles.uploadButton}>
                                    Browse Files
                                    <input type="file" accept="image/png, image/jpeg" />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.box}>
                        <h5>Course Status</h5>
                        <div className={styles.detailForm}>
                            <label htmlFor="status">Product Status</label>
                            <select name="status" id="status">
                                <option value={null}>Published</option>
                            </select>
                            <label htmlFor="" className={styles.checkbox}>
                                <input type="checkbox" name="" id="" />
                                Hide this course
                            </label>
                        </div>
                    </div>


                    <div className={styles.box}>
                        <h5>Course Level</h5>
                        <div className={styles.detailForm}>
                            <label htmlFor="level">Level</label>
                            <select name="level" id="level" value={course.level} onChange={handleInputChange}>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                            <label htmlFor="" className={styles.checkbox}>
                                <input type="checkbox" value="Special" name="" id="" />
                                Special Course
                            </label>
                        </div>
                    </div>


                    <div className={styles.box}>
                        <div className="calBox">
                            <Calendar />
                        </div>
                    </div>

                </div>

            </div>

        </form>
        }

        <Modal isOpen={isOpenClass}>
            <div className={styles.addContent}>
                <div className={styles.head}>
                    <h3>Add Class</h3>
                    <button onClick={()=>setIsOpenClass(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>
                <form action={''} className={styles.contentBody}>
        
                    {titleErrorMsg && <p style={{color: 'red', fontSize: '12px'}}>Title can't be empty</p>}
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" placeholder="Enter title"
                        value={newLessonTitle} onChange={(e)=>setNewLessonTitle(e.target.value)}
                    />

                    <label htmlFor="title">Description</label>
                    <textarea type="text" name="title" id="description" placeholder="Enter description" />

                    <div className={styles.contain}>
                        <div>
                            <h5>Start Date & Time</h5>
                            <input type="datetime-local" name="start_date" onChange={''} />
                        </div>
                        <div>
                            <h5>End Date & Time</h5>
                            <input type="datetime-local" name="end_date" onChange={''}/>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
        </>
    )
}