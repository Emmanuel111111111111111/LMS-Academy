import React, { useEffect, useRef, useState } from "react";
import styles from './StudentPage.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";

export const StudentPage = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const scroll = useRef(null);
    const actionsRef = useRef(null);



    const students = [
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Inactive'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Inactive'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Inactive'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Inactive'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Inactive'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Inactive'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Inactive'
        },
        {
            name: 'John Raymond',
            course: 'Machine Learning',
            date: 'July 1, 2024',
            phone_number: '09041638647',
            email: 'johndow2024@gmail.com',
            status: 'Active'
        }
    ]

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStudents = students.slice(indexOfFirstItem, indexOfLastItem);

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
            <div className={styles.breadcrumb}><a ref={scroll}>Student</a> {'>'} All</div>

            <h3>All Students</h3>
            
            <table className={styles.studentsTable}>
                <thead>
                    <th><input type="checkbox" /></th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Date Added</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                    <th>Action</th>
                </thead>
                <tbody>
                    {currentStudents.map((student, index) => (
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>{student.name}</td>
                            <td>{student.course}</td>
                            <td>{student.date}</td>
                            <td>{student.phone_number}</td>
                            <td>{student.email}</td>
                            <td>
                                <div className={student.status.toLowerCase() === 'active' ? styles.active : styles.inactive}>
                                    {student.status}
                                </div>
                            </td>
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
                    currentData={students}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />

            </div>
        </div>
        </>
    )
}