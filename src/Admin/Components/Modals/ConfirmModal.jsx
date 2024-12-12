import React, { useState } from "react";
import Modal from "../../Page/ActiveCourses/Modal";
import styles from './Modal.module.css';
import { getImageUrl } from "../../../utilis";
import axios from "axios";
import { BASE_URL, TEST_URL } from "../../../../config";


export const ConfirmModal = ({ isOpenConfirm, setIsOpenConfirm, cohort, selected, confirmType, reload }) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ openSuccess, setOpenSuccess ] = useState(false);


    const handleSuspension = async () => {
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
            const result = await axios.post(BASE_URL + '/suspend-course', values)
            console.log(result);
            
            setIsOpenConfirm(false);
            setIsLoading(false);
            handleSuccess();
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
            
            setIsOpenConfirm(false);
            setIsLoading(false);
            handleSuccess();
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
        <Modal isOpen={isOpenConfirm}>
            <div className={styles.confirmMod}>
                <div className={styles.head}>
                    <div>
                        <h3 style={{textTransform: 'capitalize'}}>{confirmType} Course</h3>
                        <p>{selected.course_name}</p>
                    </div>
                    <button onClick={()=>setIsOpenConfirm(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>

                <div className={styles.contentBody}>
                    <p>Are you sure you want to <b>{confirmType}</b> the course: {selected.course_name}</p>
                    
                    <button className={styles.cohortButton} onClick={confirmType === "suspend" ? handleSuspension : confirmType === "remove" ? handleRemoving : ''}>
                        {isLoading ? "..." : confirmType}
                    </button>

                </div>


            </div>
        </Modal>


        <Modal isOpen={openSuccess}>
            <div className={styles.confirmMod}>
                Course <b>{selected.course_name}</b> {
                    confirmType === 'suspend' ? 'suspended'
                    : confirmType === 'remove' ? 'removed'
                    : ''
                }
            </div>
        </Modal>

        </div>
    )
}