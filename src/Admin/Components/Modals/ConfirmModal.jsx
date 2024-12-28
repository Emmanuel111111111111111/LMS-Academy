import React, { useState } from "react";
import Modal from "../../Page/ActiveCourses/Modal";
import styles from './Modal.module.css';
import { getImageUrl } from "../../../utilis";
import axios from "axios";
import { BASE_URL, TEST_URL } from "../../../../config";
import { it } from "date-fns/locale";


export const ConfirmModal = ({ isOpen, setOpen, item, cohort, selected, confirmType, reload }) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ openSuccess, setOpenSuccess ] = useState(false);


    const handleSuspension = async () => {
        setIsLoading(true);
        const courseValues = {
            cohort_id: cohort.cohort_id,
            course_id:  selected.course_id,
            cohort_name: cohort.cohort_name,
            course_name:  selected.course_name,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }

        const teacherValues = {
            instructor_id:  selected.instructor_id,
            instructor_name:  selected.first_name + (selected.last_name != null ? ' ' + selected.last_name : ''),
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }
        try {
            if (item.toLowerCase() === "course") {
                const result = await axios.post(BASE_URL + '/suspend-course', courseValues)
                console.log(result);
                handleSuccess();
            }

            if (item.toLowerCase() === "teacher") {
                console.log('here')
                const result = await axios.put(BASE_URL + '/suspend-teacher', teacherValues)
                console.log(result);
                handleSuccess();
            }
            
            setOpen(false);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }

    const handleRemoving = async () => {
        setIsLoading(true);
        const values = {
            cohort_id: cohort.cohort_id,
            course_id:  selected.course_id,
            cohort_name: cohort.cohort_name,
            course_name:  selected.course_name,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }
        console.log(values);
        try {
            const result = await axios.post(BASE_URL + '/remove-course', values)
            console.log(result);
            
            setOpen(false);
            setIsLoading(false);
            handleSuccess();
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }


    const handleDelete = async () => {
        setIsLoading(true);
        const courseValues = {
            course_id:  selected.course_id,
            course_name:  selected.name,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }

        const teacherValues = {
            instructor_id:  selected.instructor_id,
            instructor_name:  selected.first_name + (selected.last_name != null ? ' ' + selected.last_name : ''),
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        }

        try {
            if (item.toLowerCase() === "course") {
                const result = await axios.put(BASE_URL + '/delete-course', courseValues)
                console.log(result);
                handleSuccess();
            }

            if (item.toLowerCase() === "teacher") {
                const result = await axios.put(BASE_URL + '/delete-teacher', teacherValues)
                console.log(result);
                handleSuccess();
            }
            
            // setOpen(false);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }

    const handleSuccess = () => {
        setOpenSuccess(true);
        setTimeout(() => setOpenSuccess(false), 3000);
        setTimeout(() => reload(), 3000);
    }




    
    return (
        <div>
        <Modal isOpen={isOpen}>
            <div className={styles.confirmMod}>
                <div className={styles.head}>
                    <div>
                        <h3 style={{textTransform: 'capitalize'}}>{confirmType} {item}</h3>
                        <p>{selected.course_name}</p>
                    </div>
                    <button onClick={()=>setOpen(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>

                <div className={styles.contentBody}>
                    <p>Are you sure you want to <b>{confirmType}</b> the {item}: {item.toLowerCase() === "course" ? (selected.course_name ? selected.course_name : selected.name)
                                                                                : item.toLowerCase() === 'teacher' ? selected.first_name + (selected.last_name != null ? ' ' + selected.last_name : '')
                                                                                : ''}
                    </p>
                    
                    <button className={styles.cohortButton} onClick={confirmType === "suspend" ? handleSuspension : confirmType === "remove" ? handleRemoving : confirmType === 'delete' ? handleDelete : ''}>
                        {isLoading ? "..." : confirmType}
                    </button>

                </div>


            </div>
        </Modal>


        <Modal isOpen={openSuccess}>
            <div className={styles.confirmMod}>
                {item} <b>{selected.course_name}</b> {
                    confirmType === 'suspend' ? 'suspended'
                    : confirmType === 'remove' ? 'removed'
                    : confirmType === 'delete' ? 'deleted'
                    : ''
                }
            </div>
        </Modal>

        </div>
    )
}