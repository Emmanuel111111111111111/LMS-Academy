import React, { useEffect, useRef, useState } from "react";
import styles from './TaskPage.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";
// import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";


export const TaskPage = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ search, setSearch ] = useState("");
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    const scroll = useRef(null);
    const actionsRef = useRef(null);


    const tasks = [
        {
            studentName: 'John Doe',
            course: 'Data Science',
            title: 'Quiz',
            dueDate: '2024-06-01 12:38:00',
            status: 'Graded'
        },
        {
            studentName: 'John Doe',
            course: 'Data Science',
            title: 'Quiz',
            dueDate: '2024-06-01 12:38:00',
            status: 'Graded'
        },
        {
            studentName: 'John Doe',
            course: 'Data Science',
            title: 'Quiz',
            dueDate: '2024-06-01 12:38:00',
            status: 'Graded'
        },
        {
            studentName: 'John Doe',
            course: 'Data Science',
            title: 'Quiz',
            dueDate: '2024-06-01 12:38:00',
            status: 'Pending'
        },
        {
            studentName: 'John Doe',
            course: 'Data Science',
            title: 'Quiz',
            dueDate: '2024-06-01 12:38:00',
            status: 'Pending'
        },
        {
            studentName: 'John Doe',
            course: 'Data Science',
            title: 'Quiz',
            dueDate: '2024-06-01 12:38:00',
            status: 'Pending'
        },
        {
            studentName: 'John Doe',
            course: 'Data Science',
            title: 'Quiz',
            dueDate: '2024-06-01 12:38:00',
            status: 'Graded'
        },
    ]

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredTasks = tasks.filter(task => {
        const searchLower = search.toLowerCase();
        return (
            task.studentName.toLowerCase().includes(searchLower) ||
            task.course.toLowerCase().includes(searchLower) ||
            task.title.toLowerCase().includes(searchLower)
        );
    });


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePageNumber = (itemNumber) => {
        setItemsPerPage(itemNumber);
        setCurrentPage(1);
        scroll.current.scrollIntoView();
    };


    const toggleAction = (event, index) => {
        event.stopPropagation();
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
            <p className={styles.breadcrumb}>Tasks</p>

            <div className={styles.taskHeader}>
                <h5>Tasks</h5>
                <div className={styles.buttons}>
                    <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                    <button className={styles.buttonTwo}><img src={getImageUrl('whitePlus.png')} />Add New Task</button>
                </div>
            </div>


            <div className={styles.overviews}>
                
                <div className={styles.eachOverview}>
                    <div className={styles.overviewText}>
                        Total <br /> Tasks
                        <div className={styles.blueBox}><img src={getImageUrl('assignment.png')} /></div>
                    </div>
                    <h4>100</h4>
                </div>

                <div className={styles.eachOverview}>
                    <div className={styles.overviewText}>
                        Pending <br /> Grading
                        <div className={styles.blueBox}><img src={getImageUrl('forStudents.png')} /></div>
                    </div>
                    <h4>124</h4>
                </div>

                <div className={styles.eachOverview}>
                    <div className={styles.overviewText}>
                        Completed <br />Tasks
                        <div className={styles.blueBox}><img src={getImageUrl('teachersIcon.png')} /></div>
                    </div>
                    <h4>52</h4>
                </div>
            </div>



            <div className={styles.search}>
                <img src={getImageUrl('searchIcon.png')} alt="" />
                <input onChange={handleSearch} type="text" placeholder="Search by student name, course, or task ID" />
            </div>

            <div className={styles.tasks}>
                <h3>Recent Tasks</h3>

                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :
            
                    filteredTasks.length === 0 ?
                        
                        <p className={styles.none}>No Tasks Found</p>
                        :
                        <>
                        <table className={styles.tasksTable} ref={scroll}>
                            <thead>
                                <th className={styles.checkbox}><input type="checkbox" /></th>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Task Title</th>
                                <th>Submission Date</th>
                                <th>Status</th>
                                <th className={styles.action}>Action</th>
                            </thead>
                            <tbody>
                                {currentTasks.map((task, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{task.studentName}</td>
                                        <td>{task.course}</td>
                                        <td>{task.title}</td>
                                        <td>{format(new Date(task.dueDate), 'MMMM d, yyyy hh:mm:ss a')}</td>
                                        <td>
                                            <div className={task.status.toLowerCase() === 'graded' ? styles.graded
                                                        : task.status.toLowerCase() === 'pending' ? styles.pending
                                                        : ''
                                            }>
                                                <div></div>
                                                {task.status}
                                            </div>
                                        </td>
                                        <td>
                                            <button className={styles.actionsButton} onClick={(e) => toggleAction(e, index)}>
                                                <img src={getImageUrl('threeDots.png')} alt="" />
                                            </button>
                                            {actionsOpen[index]&& <div className={styles.theActions} ref={actionsRef}>
                                                <h5>ACTION</h5>
                                                <button><img src={getImageUrl('edit.png')} />VIEW TASK</button>
                                                <button><img src={getImageUrl('approve.png')} />GRADE TASK</button>
                                                <button><img src={getImageUrl('approve.png')} />DOWNLOAD</button>
                                            </div>}
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
                                currentData={filteredTasks}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                onPageChange={handlePageChange}
                            />

                        </div>
                        </>
                }
                
                
            </div>
        </div>
        </>
    )
}