/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import styles from './TeacherPage.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";
import Modal from "../../Components/AdminCourse/Modal";
import axios from 'axios';
import { format } from 'date-fns';
import { BASE_URL } from "../../../../config";


export const TeachersPage = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const scroll = useRef(null);
    const actionsRef = useRef(null);
    const [ open, setOpen ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ teachers, setTeachers ] = useState([]);
    
    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const result = await axios(BASE_URL + "/teachers");
            console.log(result);
            setTeachers(result.data);
        } catch (err) {
            console.log(err);
        }
    }

    const [ newTeacherValues, setNewTeacherValues ] = useState({
        name: '',
        course: '',
        date: '',
        email: '',
        phone_number: '',
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
    }



    // const teachers = [
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     },
    //     {
    //         name: 'John Raymond',
    //         course: 'Machine Learning',
    //         date: 'July 1, 2024',
    //         email: 'johndow2024@gmail.com',
    //         phone_number: '09041638647'
    //     }
    // ]

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
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
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

                        <form onSubmit={handleSubmit}>
                            <div className={styles.content}>
                                <div>
                                    <h5>Instructor's Name</h5>
                                    <input type="text" placeholder="Enter Event Name" name="name" onChange={handleInput}></input>
                                </div>
                                <div>
                                    <h5>Course</h5>
                                    <select id="" name="course" onChange={handleInput}>
                                        <option value="">Select Course</option>
                                    </select>
                                </div>
                                <div>
                                    <h5>Date Added</h5>
                                    <input type="date" name="date" id="" onChange={handleInput} />
                                </div>

                            </div>
                            <div className={styles.contain}>
                                <div>
                                    <h5>Email Address</h5>
                                    <input type="email" placeholder="Enter Email Address" name="email" onChange={handleInput}></input>
                                </div>
                                <div>
                                    <h5>Phone Number</h5>
                                    <input type="tel" placeholder="Enter Phone Number" name="phone_number" onChange={handleInput}></input>
                                </div>
                            </div>
                            <button className={styles.submit}>Submit</button>
                        </form>
                    </div>
                    </>
                </Modal>

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
            </div>
        </>
    )
}