import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./Detail.module.css";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";
import Modal from "../../Page/ActiveCourses/Modal";

export const Detail = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const [ courseID, setCourseID ] = useState(location.state);
    // const [ course, setCourse ] = useState(location.state);
    const [ course, setCourse ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ charCount, setCharCount ] = useState(course.description != null ? (255 - course.description.length) : 255);
    const [ isOpenContent, setIsOpenContent ] = useState(false);
    const [ newLessonTitle, setNewLessonTitle ] = useState('');
    const [ titleErrorMsg, setTitleErrorMsg ] = useState(false);

    useEffect(() => {
        loadCourseDetails();
    }, [])

    const loadCourseDetails = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/courses-instructor-studentscount-lessons`);
            console.log(result.data.filter(e => e.course_id === courseID)[0]);
            setCourse(result.data.filter(e => e.course_id === courseID)[0]);
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
                // loadCourseDetails();
                navigate('/admin-dashboard/courses');
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
                setIsOpenContent(false);
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

    return(
        <>
        <form className={styles.whole} onSubmit={handleSubmit}>
            <div className={styles.breadcrumb}><a href="/admin-dashboard/courses">Courses</a> {'>'} {course.name}</div>

            <div className={styles.courseTitle}>
                <h3>{course.name}</h3>
                <div className={styles.buttons}>
                    <button className={styles.buttonOne} onClick={handleCancel} type="button">Cancel</button>
                    <button className={styles.buttonTwo} type="submit">Save</button>
                </div>
            </div>

            {isLoading ? <p className={styles.loading}>Loading...</p> :
            
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
                            <textarea style={{width: '100%', height: '160px'}} type="text" name="description" id="" value={course.description} onChange={handleInputChange}/>
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
                            <h5>Content</h5>
                            <button type="button" onClick={()=>setIsOpenContent(true)}>+ Add new section</button>
                        </div>
                        {course.lessons && course.lessons.map((sec, i) => (
                            <div className={styles.section} key={i}>
                                <div className={styles.text}>
                                    <img src={getImageUrl('reorder.png')} alt="" />
                                    Week {i + 1} - Beginner - {sec.title}
                                </div>
                                <button type="button"><img src={getImageUrl('threeDots.png')} /></button>
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
                            <label htmlFor="">Product Status</label>
                            <select name="" id="">
                                <option value="">Published</option>
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
                            <label htmlFor="">Level</label>
                            <select name="" id="">
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
                        <div className={styles.flexHeader} style={{margin: 0}}>
                            <h5>Cohort</h5>
                            <button type="button">+ Add Cohort</button>
                        </div>
                        <div className={styles.detailForm}>
                            <label htmlFor="">Level</label>
                            <select name="" id="">
                                <option value="">Beginner</option>
                            </select>
                            <label htmlFor="" className={styles.checkbox}>
                                <input type="checkbox" name="" id="" />
                                Universal Level
                            </label>
                        </div>
                    </div>


                    <div className={styles.box}>
                        CALENDAR
                    </div>

                </div>

            </div>
        }

        </form>

        <Modal isOpen={isOpenContent}>
            <div className={styles.addContent}>
                <div className={styles.head}>
                    <h3>Add Content</h3>
                    <button onClick={()=>setIsOpenContent(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>
                <form action={''} className={styles.contentBody}>
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" placeholder="Enter title"
                        value={newLessonTitle} onChange={(e)=>setNewLessonTitle(e.target.value)}
                    />
                    {titleErrorMsg && <p style={{color: 'red', fontSize: '12px'}}>Title can't be empty</p>}
                    <button type="button" onClick={handleNewLesson}>Submit</button>
                </form>
            </div>
        </Modal>
        </>
    )
}