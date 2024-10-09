/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import styles from './TeacherPage.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";
import Modal from "../ActiveCourses/Modal";
import axios from 'axios';
import { format } from 'date-fns';
import { BASE_URL, TEST_URL } from "../../../../config";


export const TeachersPage = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ open, setOpen ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ teachers, setTeachers ] = useState([]);
    const [ courses, setCourses ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(false);
    const scroll = useRef(null);
    const actionsRef = useRef(null);


    useEffect(() => {
        fetchTeachers();
        fetchCourses();
    }, []);

    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/teachers");
            setTeachers(result.data.sort((a,b) => new Date(b.date_added) - new Date(a.date_added)));
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setErrorMessage(true);
        }
    }

    const fetchCourses = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/courses");
            setCourses(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    const [ newTeacherValues, setNewTeacherValues ] = useState({
        name: '',
        course_id: null,
        course_name: null,
        date: new Date().toISOString().slice(0,19).replace('T', ' '),
        email: null,
        phone_number: null,
    })

    const handleInput = (event) => {
        setNewTeacherValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        setOpen(false);
        console.log(newTeacherValues);
        axios.post(BASE_URL + '/new-teacher', newTeacherValues)
            .then(res => console.log(res))
            .catch(err => console.log(err));
        fetchTeachers();
        
    }


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTeachers = teachers.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageNumber = (itemNumber) => {
        setItemsPerPage(itemNumber);
        setCurrentPage(1);
        scroll.current.scrollIntoView();
    };

    const toggleAction = (index) => {
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
    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
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
                <a ref={scroll}>Teacher</a>

                <div className={styles.teacherHeader}>
                    All Teachers

                    <div className={styles.buttons}>
                        <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                        <button className={styles.buttonTwo} onClick={handleOpen}><img src={getImageUrl('whitePlus.png')} />Add New Teacher</button>
                    </div>
                </div>
                <Modal isOpen={open} >
                    <>
                    <div className={styles.course_modal}>
                        <div className={styles.head}>
                            <h3>Add New Teacher</h3>
                            <button onClick={handleClose} className={styles.close}><img src={getImageUrl('close.png')} alt="" /></button>
                        </div>

                        <form className={styles.theForm} onSubmit={handleSubmit}>
                            <h5>Instructor's Name</h5>
                            <input type="text" placeholder="Enter Instructor Name" name="name" onChange={handleInput}></input>
                            
                            <h5>Course</h5>
                            <select id="" name="course_name" onChange={handleInput}>
                                <option value="">Select Course</option>
                                {courses.map((cour, i) => (
                                    <option key={i} value={cour.name}>{cour.name}</option>
                                ))}
                            </select>
                            
                            <h5>Email Address</h5>
                            <input type="email" placeholder="Enter Email Address" name="email" onChange={handleInput}></input>
                            
                            <h5>Phone Number</h5>
                            <input type="tel" placeholder="Enter Phone Number" name="phone_number" onChange={handleInput}></input>
                            
                            <button className={styles.submit}>Submit</button>
                        </form>
                    </div>
                    </>
                </Modal>

                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :
                
                    <>
                    <table className={styles.teacherTable}>
                        <thead>
                            <th><input type="checkbox" /></th>
                            <th>Name</th>
                            <th>Course</th>
                            <th>Date Added</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Action</th>
                        </thead>
                        <tbody>
                            {currentTeachers.map((teacher, index) => (
                                <tr>
                                    <td><input type="checkbox" /></td>
                                    <td>{teacher.first_name} {teacher.last_name}</td>
                                    <td>{teacher.course}</td>
                                    <td>{format(new Date (teacher.date_added), 'MMMM dd, yyyy')}</td>
                                    <td>{teacher.email}</td>
                                    <td>{teacher.phone_number}</td>
                                    <td>
                                        <div>
                                            <button className={styles.actionsButton} onClick={() => toggleAction(index)}><img src={getImageUrl('threeDots.png')} /></button>
                                            <div className={`${styles.actionsClosed} ${actionsOpen[index] && styles.theActions}`} ref={actionsRef}>
                                                <h5>ACTION</h5>
                                                <button><img src={getImageUrl('approve.png')} />SUSPEND</button>
                                                <button><img src={getImageUrl('delete.png')} />DECLINE</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ w: '100%', display: "flex", alignItems: 'center' }}>
                        <div className={styles.showRows}>
                            Show
                            <select onChange={(e) => handlePageNumber(e.target.value)} >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </select>
                            Rows
                        </div>
                        <Pagination className={styles.pag}
                            currentData={teachers}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            onPageChange={handlePageChange}
                        />

                    </div>

                    </>
                }

                
            </div>
        </>
    )
}