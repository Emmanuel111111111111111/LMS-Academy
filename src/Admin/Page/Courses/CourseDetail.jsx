import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./CourseDetail.module.css";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";
import Modal from "../../Components/Modals/Modal";
import Calendar from "react-calendar";
import "../../../App.css";
import { customToast } from "../../../Components/Notifications";
import { ConfirmModal } from "../../Components/Modals/ConfirmModal";


export const CourseDetail = () => {

    const {courseId} = useParams();
    const [ course, setCourse ] = useState([]);
    const [ charCount, setCharCount ] = useState(course?.description != null ? (255 - course.description.length) : 255);
    const [ isLoading, setIsLoading ] = useState(false);
    
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ isOpenClass, setIsOpenClass ] = useState(false);
    const [ newLessonTitle, setNewLessonTitle ] = useState('');
    const [ titleErrorMsg, setTitleErrorMsg ] = useState(false);
    
    const [ selected, setSelected ] = useState({});
    const [ confirmType, setConfirmType ] = useState('');
    const [ isOpenConfirm, setIsOpenConfirm ] = useState(false);

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
            setCourse(result.data.filter(e => e.course_id === parseInt(courseId))[0]);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            customToast("We're having trouble getting the course details. Try again later.")
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
                customToast('Course was updated successfully')
                // loadCourseDetails();
                navigate('/admin-dashboard/courses');
            } else {
                console.error("Failed to update course");
            }
        } catch (error) {
            console.log('Error updating course:', error);
            customToast("There was an error while updating the course. Please try again.")
        }
    };

    const handleCancel = () => {
        navigate('/admin-dashboard/courses');
    }


    const [ newLesson, setNewLesson ] = useState({
        name: null,
        description: null,
        course_id: null,
        start_date: null,
        end_date: null
    })

    const newLessonInput = (event) => {
        setNewLesson(prev => ({ ...prev, 'course_id': course.course_id }));
        setNewLesson(prev => ({ ...prev, [event.target.name]: event.target.value }))

        if ((event.target.name === 'start_date')
        || (event.target.name === 'end_date')) {
            setNewLesson(prev => ({ ...prev, [event.target.name]: event.target.value.replace('T', ' ') + '+01' }))
        }
    }
    const handleNewLesson = async (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        if (!newLesson.name.trim()) {
            setTitleErrorMsg(true);
            return;
        }

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
                customToast('Lesson added successfully');
            } else {
                customToast('Failed to add lesson');
            }
        } catch (error) {
            console.error('Error adding lesson:', error);
            customToast('Error adding lesson');
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

    const goToLesson = (id) => {
        window.location.href = `/admin-dashboard/classes/${id}`
    }
    const handleDelete = (clas) => {
        setSelected(clas);
        setConfirmType('delete');
        setIsOpenConfirm(true);
    }


    return(
        <>        
        {isLoading ? <p className={styles.loading}>Loading...</p> :

        <form className={styles.whole} onSubmit={handleSubmit}>

            <div className={styles.breadcrumb}><a href="/admin-dashboard/courses">Courses</a> {'>'} {course.course_name}</div>

            <div className={styles.courseTitle}>
                <h3>{course.course_name}</h3>
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
                            <input type="text" name="name" id="name" value={course.course_name} onChange={handleInputChange}/>

                            <label htmlFor="description">Description</label>
                            <textarea style={{width: '100%', height: '100px'}} type="text" name="description" id="" value={course.description} onChange={handleInputChange}/>
                            <p>{charCount} characters left</p>
                        </div>
                    </div>

                    {/* <div className={styles.box}>
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
                    </div> */}

                    <div className={styles.box}>
                        <div className={styles.flexHeader}>
                            <h5>Classes</h5>
                            <button type="button" onClick={()=>setIsOpenClass(true)}>+ Add new class</button>
                        </div>
                        {course.lessons && course.lessons.map((cla, i) => (
                            <div className={styles.section} key={i}>
                                <div className={styles.text}>
                                    <button type="button"><img src={getImageUrl('reorder.png')} alt="" /></button>
                                    Class {i + 1} - {course.level} - {cla.lesson_title}
                                </div>
                                <div>
                                    <button type="button" className={styles.actionButton} onClick={(e) => toggleAction(e, i)}>
                                        <img src={getImageUrl('threeDots.png')} />
                                    </button>
                                    {actionsOpen[i] && <div className={styles.theActions} ref={actionsRef}>
                                        <h6>ACTION</h6>
                                        <button onClick={()=>goToLesson(cla.lesson_id)}><img src={getImageUrl('edit.png')} />EDIT</button>
                                        <button onClick={()=>handleDelete(cla)}><img src={getImageUrl('delete.png')} />DELETE</button>
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
                        <button type="button" onClick={()=>navigate(`/admin-dashboard/courses/preview/${course.course_id}`)}>Preview</button>
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
                <form className={styles.contentBody}>
        
                    {titleErrorMsg && <p style={{color: 'red', fontSize: '12px'}}>Title can't be empty</p>}
                    <label htmlFor="title">Title</label>
                    <input type="text" name="name" id="title" placeholder="Enter title" onChange={newLessonInput}
                    />

                    <label htmlFor="title">Description</label>
                    <input type="text" name="description" id="description" placeholder="Enter description" onChange={newLessonInput} />
                    
                    <h5>Start Date & Time</h5>
                    <input type="datetime-local" name="start_date" onChange={newLessonInput} />
                
                    <h5>End Date & Time</h5>
                    <input type="datetime-local" name="end_date" onChange={newLessonInput}/>
                        

                    <button type="submit" onClick={handleNewLesson}>Submit</button>
                </form>
            </div>
        </Modal>


        <ConfirmModal isOpen={isOpenConfirm} setOpen={setIsOpenConfirm} item={'Class'} cohort={'none'} selected={selected} confirmType={confirmType} reload={loadCourseDetails} />

        </>
    )
}