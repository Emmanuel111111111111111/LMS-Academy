import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./Classes.module.css";
import axios from 'axios';
import Modal from "../../Components/Modals/Modal";
import { format } from "date-fns";
import { BASE_URL, TEST_URL } from "../../../../config";

export const Classes = () => {

    const [ classes, setClasses ] = useState([]);
    const [ allCourses, setAllCourses ] = useState([]);
    const [ startDate, setStartDate ] = useState(null);
    // const [ isOpen, setIsOpen ] = useState(false);
    const [ open, setOpen ] = useState(false);
    const [ openSuccess, setOpenSuccess ] = useState(false);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isLoading2, setIsLoading2 ] = useState(false);
    const actionsRef = useRef(null);
    const createRef = useRef(null);

    useEffect(() => {
        fetchClasses();
        fetchAllCourses();
    }, []);

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/lessons-info", {
                timeout: 20000
            });
            setClasses(result.data);
            console.log(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            // setErrorMessage(true);
        }
    }
    const fetchAllCourses = async () => {
        try {
            const result = await axios(BASE_URL + `/courses`);
            setAllCourses(result.data)
        } catch (err) {
            console.log(err);
        }
    }

    const handleToDetails = (event, clas) => {
        window.location.href = `classes/${clas.lesson_id}`;
    }


    const [ newClassValues, setNewClassValues ] = useState({
        name: null,
        course_id: null,
        start_date: null,
        end_date: null,
    })
    
    const handleClose = () => {
        setOpen(false);
        setNewClassValues({
            name: null,
            course_id: null,
            start_date: null,
            end_date: null,
        })
    };
    const handleOpen = () => {
        setOpen(true);
    };


    const handleInput = (event) => {

        setNewClassValues(prev => ({ ...prev, [event.target.name]: event.target.value }))


        if ((event.target.name === 'start_date')
        || (event.target.name === 'end_date')) {
            setNewClassValues(prev => ({ ...prev, [event.target.name]: event.target.value.replace('T', ' ') + '+01' }))
        }


        console.log(newClassValues);
        console.log(event.target.value)
    }
    const handleSubmitClass = async (event) => {
        event.preventDefault();
        console.log(newClassValues);
        setIsLoading2(true);
        try {

            const response = await axios.post(BASE_URL + '/new-lesson', newClassValues);
            setIsLoading2(false);
            handleSuccess();
            console.log(response);
            handleClose();
            
        } catch (err) {
            console.log(err);
            setIsLoading2(false);
        }
    }

    const handleSuccess = () => {
        setOpenSuccess(true);
        setTimeout(() => setOpenSuccess(false), 3000);
        setTimeout(() => fetchClasses(), 3000);
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
        if (createRef.current && !createRef.current.contains(event.target)) {
            setOpen(false);
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

            <div className={styles.breadcrumb}>Classes</div>

            <div>
                <div className={styles.title}>
                    <h1>Classes</h1>
                    <div className={styles.buttons}>
                        <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                        <button className={styles.buttonTwo} onClick={handleOpen} ><img src={getImageUrl('whitePlus.png')} />Create Class</button>
                    </div>
                </div>


                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :

                    classes.length === 0 ?
                                        
                    <p className={styles.none}>No Classes Found</p>
                    :
                    <div className={styles.classes}>
                        
                        {classes.map((clas, index) => (
                            <div key={index} className={styles.classInfo} id="outer">
                                {/* <div className={styles.classImage}>
                                    <img src={getImageUrl('frame7.png')} />
                                </div> */}
                                <div className={styles.infoHeader}>
                                    <h3>{clas.title}</h3>
                                    <div>
                                        <button className={styles.actionsButton} onClick={(e) => toggleAction(e, index)}><img src={getImageUrl('threeDots.png')} /></button>
                                        {actionsOpen[index] && <div className={styles.theActions} ref={actionsRef}>
                                            <h5>ACTION</h5>
                                            <button onClick={(e)=>handleToDetails(e, clas)}><img src={getImageUrl('edit.png')} />EDIT</button>
                                            <button><img src={getImageUrl('approve.png')} />SUSPEND</button>
                                            <button><img src={getImageUrl('delete.png')} />DELETE</button>
                                        </div>}
                                    </div>
                                </div>
                                <p>Course: {clas.course_name}</p>
                                <div className={styles.classData}>
                                    {/* <div className={styles.timeData}><img src={getImageUrl('timer.png')} alt="" />{(Math.abs(new Date(clas.end_date) - new Date(clas.start_date))/1000 * 60 * 60).toFixed(1)}</div> */}
                                    {clas.start_date != null && <div className={styles.timeData}><img src={getImageUrl('blueCalendar.png')} alt="" />{format(new Date(clas.start_date), 'd MMM')}</div>}
                                </div>
                                <div className={styles.crumb}>
                                    <div className={styles.profile}><img src={getImageUrl('profile.svg')} alt="" />{clas.instructor_name}</div>
                                    <div className={styles.students}><img src={getImageUrl('frame5.png')} alt="" />{clas.student_count} {clas.student_count === 1 ? 'Student' : 'Students'}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>


        <Modal isOpen={open} >
            <form className={styles.class_modal} onSubmit={handleSubmitClass}>
                <div className={styles.head}>
                    <h3>Create Class</h3>
                    <button onClick={handleClose} className={styles.close}><img src={getImageUrl('close.png')} alt="" /></button>
                </div>

                <div style={{overflow: 'auto'}}>
                    <div className={styles.formDiv}>
                        <h5>Class Name</h5>
                        <input type="text" name="name" placeholder="Enter Class Name" onChange={handleInput} required></input>
                    </div>

                    <div className={styles.formDiv}>
                        <h5>Course</h5>
                        <select name="course_id" onChange={handleInput} required>
                            <option className={styles.first} value="">Select Course</option>
                            {allCourses.map((cours, index) => (
                                <option key={index} value={cours.course_id}>{cours.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.contain}>
                        <div>
                            <h5>Start Date & Time</h5>
                            <input
                                type="datetime-local"
                                name="start_date"
                                // min={newClassValues.course_id && new Date(newClassValues.course_id).toISOString().split("T")[0]}
                                onChange={handleInput}
                            />
                        </div>
                        <div>
                            <h5>End Date & Time</h5>
                            <input type="datetime-local" name="end_date" onChange={handleInput}/>
                        </div>
                    </div>
                </div>

                <button className={styles.submit}>{isLoading2 ? '...' : 'Submit'}</button>

            </form>
        </Modal>


        <Modal isOpen={openSuccess}>
            <div className={styles.added}>
                Class ADDED!
            </div>
        </Modal>

        </>
    )
}