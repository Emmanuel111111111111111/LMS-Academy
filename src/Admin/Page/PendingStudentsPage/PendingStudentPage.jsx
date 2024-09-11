import React, { useEffect, useRef, useState } from "react";
import styles from './PendingStudentPage.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";


export const PendingStudentPage = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const scroll = useRef(null);
    const actionsRef = useRef(null);



    const pendingStudents = [
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Online',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Physical',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Online',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Physical',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Physical',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Physical',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Online',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Physical',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Online',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Online',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            desried_course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            learning_mode: 'Physical',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        }
    ]

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPendingStudents = pendingStudents.slice(indexOfFirstItem, indexOfLastItem);

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
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);



    return (
        <>
        <div className={styles.whole}>
            <div className={styles.breadcrumb}><a href="/admin-dashboard/student" ref={scroll}>Student</a> {'>'} Pending</div>

            <h3>Pending Students</h3>
            
            <table className={styles.pendingStudentsTable}>
                <thead>
                    <th><input type="checkbox" /></th>
                    <th>Name</th>
                    <th>Desired Course</th>
                    <th>Date</th>
                    <th>Phone Number</th>
                    <th>Preferred Mode of Learning</th>
                    <th>Email</th>
                    <th>Action</th>
                </thead>
                <tbody>
                    {currentPendingStudents.map((student, index) => (
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>{student.name}</td>
                            <td>{student.desried_course}</td>
                            <td>{student.date}</td>
                            <td>{student.phone_number}</td>
                            <td>
                                <div className={student.learning_mode.toLowerCase() === 'online' ? styles.online : styles.physical}>
                                    {student.learning_mode}
                                </div>
                            </td>
                            <td>{student.email}</td>
                            <td>
                                <div>
                                    <button className={styles.actionsButton} onClick={()=>toggleAction(index)}><img src={getImageUrl('threeDots.png')} /></button>
                                    <div className={`${styles.actionsClosed} ${actionsOpen[index] && styles.theActions}`} ref={actionsRef}>
                                        <h5>ACTION</h5>
                                        <button><img src={getImageUrl('approve.png')} />APPROVE</button>
                                        <button><img src={getImageUrl('delete.png')} />DECLINE</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ w:'100%', display:"flex", alignItems:'center' }}>
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
                    currentData={pendingStudents}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />

            </div>
        </div>
        </>
    )
}