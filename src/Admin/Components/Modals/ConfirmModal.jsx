import React, { useState } from "react";
import Modal from "./Modal";
import styles from './Modal.module.css';
import { getImageUrl } from "../../../utilis";
import axios from "axios";
import { BASE_URL, TEST_URL } from "../../../../config";
import { customToast, customToastError } from "../../../Components/Notifications";


export const ConfirmModal = ({ isOpen, setOpen, item, cohort, selected, confirmType, reload }) => {

    const [ isLoading, setIsLoading ] = useState(false);

    const successToast = () => {
        customToast(`${item} ${<b>
            {item.toLowerCase() === "course" ? (selected.course_name ? selected.course_name : selected.name)
            : item.toLowerCase() === 'teacher' ? selected.first_name + (selected.last_name != null ? ' ' + selected.last_name : '')
            : item.toLowerCase() === 'class' ? (selected.lesson_title ? selected.lesson_title : selected.title)
            : item.toLowerCase() === 'exam' ? (selected.exam_name ? selected.exam_name : selected.name)
            : item.toLowerCase() === 'assignment' ? (selected.assignment_name ? selected.assignment_name : selected.name)
            : ''}
        </b>} ${
            confirmType === 'suspend' ? 'suspended'
            : confirmType === 'remove' ? 'removed'
            : confirmType === 'delete' ? 'deleted'
            : confirmType === 'resume' ? 'resumed'
            : ''
        } successfully.`)
    }
    const errorToast = () => {
        customToastError(`Error ${
            confirmType === 'suspend' ? 'suspending'
            : confirmType === 'remove' ? 'removing'
            : confirmType === 'delete' ? 'deleting'
            : confirmType === 'resume' ? 'resuming'
            : ''
        } ${item}. Try again later.`)
    }


    const handleSuspension = async () => {
        setIsLoading(true);
        const courseValues = {
            cohort_id: cohort.cohort_id,
            course_id:  selected.course_id,
            cohort_name: cohort.cohort_name,
            course_name:  selected.course_name,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user: sessionStorage.getItem('full_name')
        }

        const teacherValues = {
            instructor_id:  selected.instructor_id,
            instructor_name:  selected.first_name + (selected.last_name != null ? ' ' + selected.last_name : ''),
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user: sessionStorage.getItem('full_name'),
        }
        try {
            if (item.toLowerCase() === "course") {
                const result = await axios.post(BASE_URL + '/suspend-course', courseValues)
                console.log(result.status);
            }
            else if (item.toLowerCase() === "teacher") {
                const result = await axios.put(BASE_URL + '/suspend-teacher', teacherValues)
                console.log(result.status);
            }
            
            setOpen(false);
            setIsLoading(false);
            successToast();
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            errorToast();
        }
    }

    const handleResumption = async () => {
        setIsLoading(true);
        const courseValues = {
            cohort_id: cohort.cohort_id,
            course_id:  selected.course_id,
            cohort_name: cohort.cohort_name,
            course_name:  selected.course_name,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user: sessionStorage.getItem('full_name')
        }

        // const teacherValues = {
        //     instructor_id:  selected.instructor_id,
        //     instructor_name:  selected.first_name + (selected.last_name != null ? ' ' + selected.last_name : ''),
        //     date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        //     user: sessionStorage.getItem('full_name'),
        // }
        try {
            if (item.toLowerCase() === "course") {
                await axios.post(BASE_URL + '/resume-course', courseValues)
            }

            // else if (item.toLowerCase() === "teacher") {
            //     const result = await axios.put(BASE_URL + '/suspend-teacher', teacherValues);
            // }
            
            setOpen(false);
            setIsLoading(false);
            successToast();
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            errorToast();
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
            user: sessionStorage.getItem('full_name'),
        }
        try {
            const result = await axios.post(BASE_URL + '/remove-course', values)
            console.log(result.status);
            
            setOpen(false);
            setIsLoading(false);
            successToast();
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            errorToast();
        }
    }


    const handleDelete = async () => {
        setIsLoading(true);

        const courseValues = {
            course_id:  selected.course_id,
            course_name:  selected.name,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user: sessionStorage.getItem('full_name'),
        }

        const teacherValues = {
            instructor_id:  selected.instructor_id,
            instructor_name:  selected.first_name + (selected.last_name != null ? ' ' + selected.last_name : ''),
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user: sessionStorage.getItem('full_name'),
        }

        const lessonValues = {
            lesson_id:  selected.lesson_id,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user: sessionStorage.getItem('full_name'),
        }

        const examValues = {
            exam_id: selected.exam_id,
            exam_name:  selected.exam_name,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user: sessionStorage.getItem('full_name'),
        }

        const assignmentValues = {
            assignment_id: selected.assignment_id,
            assignment_name:  selected.assignment_name,
            date: new Date().toISOString().slice(0, 19).replace('T', ' '),
            user: sessionStorage.getItem('full_name'),
        }

        try {
            if (item.toLowerCase() === "course") {
                const result = await axios.put(BASE_URL + '/delete-course', courseValues)
                console.log(result.status);
            }

            if (item.toLowerCase() === "teacher") {
                const result = await axios.put(BASE_URL + '/delete-teacher', teacherValues)
                console.log(result.status);
            }

            if (item.toLowerCase() === "class") {
                const result = await axios.put(BASE_URL + '/delete-lesson', lessonValues)
                console.log(result.status);
            }

            if (item.toLowerCase() === "exam") {
                const result = await axios.put(BASE_URL + '/delete-exam', examValues)
                console.log(result.status);
            }

            if (item.toLowerCase() === "assignment") {
                const result = await axios.put(BASE_URL + '/delete-assignment', assignmentValues)
                console.log(result.status);
            }
            
            setOpen(false);
            setIsLoading(false);
            successToast();
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            errorToast();
        }
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
                                                                                : item.toLowerCase() === 'class' ? (selected.lesson_title ? selected.lesson_title : selected.title)
                                                                                : item.toLowerCase() === 'exam' ? (selected.exam_name ? selected.exam_name : selected.name)
                                                                                : item.toLowerCase() === 'assignment' ? (selected.assignment_name ? selected.assignment_name : selected.name)
                                                                                : ''}
                    </p>
                    
                    <button className={styles.cohortButton} onClick={confirmType === "suspend" ? handleSuspension : confirmType === "remove" ? handleRemoving : confirmType === 'delete' ? handleDelete : confirmType === 'resume' ? handleResumption : ''}>
                        {isLoading ? "..." : confirmType}
                    </button>

                </div>

            </div>
        </Modal>

        </div>
    )
}