/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from "react";
import styles from './TeacherPage.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";
import Modal from "../../Components/Modals/Modal";
import axios from 'axios';
import { format } from 'date-fns';
import { BASE_URL, TEST_URL } from "../../../../config";
import { ConfirmModal } from "../../Components/Modals/ConfirmModal";
import { customToast, customToastError } from "../../../Components/Notifications";


export const TeachersPage = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ open, setOpen ] = useState(false);
    const [ teachers, setTeachers ] = useState([]);
    const [ courses, setCourses ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ selected, setSelected ] = useState({});
    const [ confirmType, setConfirmType ] = useState('');
    const [ isOpenConfirm, setIsOpenConfirm ] = useState(false);
    const scroll = useRef(null);
    const actionsRef = useRef(null);

    const username = sessionStorage.getItem('full_name');


    useEffect(() => {
        
        const authToken = sessionStorage.getItem("role");
        const lastLogged = sessionStorage.getItem("last_logged");
        if ((!sessionStorage) || (!authToken) || (authToken != "Admin") || (!lastLogged) || (new Date() - new Date(lastLogged) >= 604800000)) {
            window.location.href = "/admin-dashboard";
        }

        fetchTeachers();
        fetchCourses();
    }, []);

    const fetchTeachers = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/teachers", {
                timeout: 10000
            });
            setTeachers(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            customToast("We're having trouble getting the teachers. Please try again.")
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
        first_name: '',
        last_name: '',
        course_id: null,
        course_name: null,
        date: new Date().toISOString().slice(0,19).replace('T', ' '),
        email: null,
        phone_number: null,
        user: username,
    })

    const handleInput = (event) => {
        if (event.target.name === 'course_name') {
            const [ course_id, course_name ] = event.target.value.split('|')
            setNewTeacherValues(prev => ({ ...prev, 'course_id': course_id }))
            setNewTeacherValues(prev => ({ ...prev, 'course_name': course_name }))
        }
        else {
            setNewTeacherValues(prev => ({ ...prev, [event.target.name]: event.target.value }))
        }
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        const validEndingsRegex = /@thefifthlab.com$|@cwg-plc.com$/g;
        if (newTeacherValues.email.match(validEndingsRegex)) {
            console.log(newTeacherValues)
                axios.post(BASE_URL + '/new-teacher', newTeacherValues)
                .then(res => customToast('Teacher added successfully'))
                .catch(err => console.log(err));
            setOpen(false);
            fetchTeachers();
        }
        else {
            customToastError('Email must be a CWG or Fifthlab email.')
        }
        
        
    }
    const handleRoleChange = async (event, id) => {
        const values = {
            role: event.target.value,
            instructor_id: id
        };
        try {
            const response = await axios.put(BASE_URL + '/change-teacher-role', values);
            console.log(response.status);
            customToast('Teacher role changed');
            fetchTeachers();
        } catch (err) {
            console.log(err);
        }
        
    }
    


    const handleDelete = (event, teach) => {
        event.stopPropagation();
        setSelected(teach);
        setConfirmType('delete');
        setIsOpenConfirm(true);
    }
    const handleSuspend = (event, teach) => {
        event.stopPropagation();
        setSelected(teach);
        setConfirmType('suspend');
        setIsOpenConfirm(true);
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
                        {sessionStorage.getItem('role') === 'Admin' && <button className={styles.buttonTwo} onClick={handleOpen}><img src={getImageUrl('whitePlus.png')} />Add New Teacher</button>}
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
                            <div className={styles.formFlex}>
                                <div>
                                <h5>First Name</h5>
                                <input type="text" placeholder="Instructor's First Name" name="first_name" onChange={handleInput} required></input>
                                </div>

                                <div>
                                <h5>Last Name</h5>
                                <input type="text" placeholder="Instructor's Last Name" name="last_name" onChange={handleInput}></input>
                                </div>
                            </div>
                            
                            <h5>Course</h5>
                            <select id="" name="course_name" onChange={handleInput}>
                                <option value="">Select Course</option>
                                {courses.map((cour, i) => (
                                    <option key={i} value={cour.course_id + '|' + cour.name}>{cour.name}</option>
                                ))}
                            </select>
                            
                            <h5>Email Address</h5>
                            <input type="email" placeholder="Enter Email Address" name="email" onChange={handleInput} required ></input>
                            
                            <h5>Phone Number</h5>
                            <input type="tel" placeholder="Enter Phone Number" name="phone_number" onChange={handleInput} required ></input>
                            
                            <button className={styles.submit}>Submit</button>
                        </form>
                    </div>
                    </>
                </Modal>

                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :
                
                    currentTeachers.length === 0 ?
                        
                        <p className={styles.none}>No Teachers Found</p>
                        :
                        <>
                        <table className={styles.teacherTable}>
                            <thead>
                                <th><input type="checkbox" /></th>
                                <th>Name</th>
                                <th>Course</th>
                                <th>Date Added</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                {sessionStorage.getItem('role') === 'Admin' && <th>Role</th>}
                                <th>Action</th>
                            </thead>
                            <tbody>
                                {currentTeachers.map((teacher, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{teacher.first_name} {teacher.last_name}</td>
                                        <td>{teacher.course}</td>
                                        <td>{format(new Date (teacher.date_added), 'MMMM dd, yyyy')}</td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.phone_number}</td>
                                        {sessionStorage.getItem('role') === 'Admin' && <td>
                                            <select name="role" id="role" value={teacher.role} onChange={(e)=>handleRoleChange(e, teacher.instructor_id)}>
                                                <option value="Teacher">Teacher</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        </td>}
                                        <td>
                                            <div>
                                                <button className={styles.actionsButton} onClick={() => toggleAction(index)}><img src={getImageUrl('threeDots.png')} /></button>
                                                <div className={`${styles.actionsClosed} ${actionsOpen[index] && styles.theActions}`} ref={actionsRef}>
                                                    <h5>ACTION</h5>
                                                    <button onClick={(e)=>handleSuspend(e, teacher)}><img src={getImageUrl('approve.png')} />SUSPEND</button>
                                                    <button onClick={(e)=>handleDelete(e, teacher)}><img src={getImageUrl('delete.png')} />DELETE</button>
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

            <ConfirmModal isOpen={isOpenConfirm} setOpen={setIsOpenConfirm} item={'Teacher'} cohort={'none'} selected={selected} confirmType={confirmType} reload={fetchTeachers} />

        </>
    )
}