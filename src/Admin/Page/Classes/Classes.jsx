import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./Classes.module.css";
import axios from 'axios';
import Modal from "../ActiveCourses/Modal";
import { format } from "date-fns";
import { BASE_URL, TEST_URL } from "../../../../config";

export const Classes = () => {

    const [ classes, setClasses ] = useState([]);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    const actionsRef = useRef(null);
    const createRef = useRef(null);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const result = await axios(TEST_URL + "/lessons-info", {
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

    const handleToDetails = (event, clas) => {
        window.location.href = `classes/${clas.lesson_id}`;
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

            <div className={styles.breadcrumb}>Classes</div>

            <div>
                <div className={styles.title}>
                    <h1>Classes</h1>
                    <div className={styles.buttons}>
                        <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                        <button className={styles.buttonTwo} onClick={''} ><img src={getImageUrl('whitePlus.png')} />Create Class</button>
                    </div>
                </div>


                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :

                    classes.length === 0 ?
                                        
                    <p className={styles.none}>No Classes Found</p>
                    :
                    <div className={styles.classes}>
                        
                        {classes.map((clas, index) => (
                            <div key={index} className={styles.classInfo} onClick={''} id="outer">
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
                                    {/* <div className={styles.timeData}><img src={getImageUrl('timer.png')} alt="" />{clas.length}</div>
                                    <div className={styles.timeData}><img src={getImageUrl('blueCalendar.png')} alt="" />{format(new Date(clas.dueDate), 'd MMM')}</div> */}
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

        </>
    )
}