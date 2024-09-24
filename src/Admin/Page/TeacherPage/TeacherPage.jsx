import React, { useEffect, useRef, useState } from "react";
import styles from './TeacherPage.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination"; 
import axios from 'axios';

export const TeachersPage = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const scroll = useRef(null);
    const actionsRef = useRef(null);
    const [ teachers, setTeachers ] = useState([]);
    
    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const result = await axios("http://localhost:8081/teachers");
            console.log(result);
            setTeachers(result.data);
        } catch (err) {
            console.log(err);
        }
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
                    <button className={styles.buttonTwo}><img src={getImageUrl('whitePlus.png')} />Add New Teacher</button>
                </div>
            </div>
            
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
                        <tr key={index}>
                            <td><input type="checkbox" /></td>
                            <td>{teacher.first_name} {teacher.last_name}</td>
                            <td>{teacher.course}</td>
                            <td>{teacher.date}</td>
                            <td>{teacher.email}</td>
                            <td>{teacher.phone_number}</td>
                            <td>
                                <div>
                                    <button className={styles.actionsButton} onClick={()=>toggleAction(index)}><img src={getImageUrl('threeDots.png')} /></button>
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