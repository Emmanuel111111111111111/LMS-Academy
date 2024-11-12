import React from "react";
import { getImageUrl } from "../../utilis";
import styles from "./CWG.module.css";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";

export const CWG = () => {

    const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure();
    const navigate = useNavigate();


    return(
        <>
        <div className={styles.bread}>
            <div className={styles.crumb}>
                <img src={getImageUrl("Frame 349.png")} alt="" />
                <a><button onClick={onOpenModal}>Get Started</button></a>
            </div>
        </div>

        <Modal closeOnOverlayClick={false} isOpen={isOpenModal} onClose={onCloseModal}>
            {/* <ModalOverlay /> */}
            <ModalContent className={styles.wholeModal}>
                <ModalHeader className={styles.modalHeader}>
                    <h3>Create your account</h3>
                    <p>Let's help you get started on the CWG Academy</p>
                </ModalHeader>

                <ModalBody>
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
                </ModalBody>
            </ModalContent>
        </Modal>

        </>
    )
}