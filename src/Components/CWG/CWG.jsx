import React, { useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./CWG.module.css";
import { useNavigate } from "react-router-dom";
import Modal from "../../Admin/Components/Modals/Modal";

export const CWG = () => {

    const [ isOpen, setIsOpen ] = useState(false);
    const navigate = useNavigate();

    const onOpen = () => {
        setIsOpen(true);
    }
    const onCloseModal = () => {
        setIsOpen(false);
    }


    return(
        <>
        <div className={styles.bread}>
            <div className={styles.crumb}>
                <img src={getImageUrl("Frame 349.png")} alt="" />
                <a><button onClick={onOpen}>Get Started</button></a>
            </div>
        </div>

        <Modal isOpen={isOpen}>
            <div className={styles.wholeModal}>
                <div className={styles.modalHeader}>
                    <h3>Log In or Sign Up</h3>
                    <p>Let's help you get started on the CWG Academy</p>
                </div>
                <div className={styles.modalBody}>
                    <button onClick={()=>navigate('/Admin-login')}>
                        <img src={getImageUrl('instructors.png')} />
                        <h4>Instructor</h4>
                        <p>Let's help you get started on CWG Academy</p>
                    </button>

                    <button onClick={()=>navigate('/Login')}>
                        <img src={getImageUrl('forStudents.png')} />
                        <h4>Students</h4>
                        <p>Let's help you get started on CWG Academy</p>
                    </button>

                </div>
            </div>
        </Modal>

        </>
    )
}