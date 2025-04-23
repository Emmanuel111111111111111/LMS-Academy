import React, { useEffect, useRef, useState } from "react";
import styles from './GradesPage.module.css';
import { format } from 'date-fns';
import axios from 'axios';
import { getImageUrl } from "../../utilis";
import Pagination from "../../Components/Pagination/Pagination";
import { BASE_URL, TEST_URL } from "../../../config";
import { customToast, customToastError } from "../../Components/Notifications";


export const GradesPage = () => {

    const [ grades, setGrades ] = useState([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ search, setSearch ] = useState("");
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    const scroll = useRef(null);
    const actionsRef = useRef(null);


    useEffect(() => {
        getGrades();
    }, [])

    const getGrades = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/grades/${sessionStorage.getItem("id")}`, {
                timeout: 20000
            });
            setGrades(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            customToastError("We're having trouble fetching your grades. Please try again later.")
        }
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredGrades = grades.filter(grade => {
        const searchLower = search.toLowerCase();
        return (
            grade.course_name.toLowerCase().includes(searchLower) ||
            grade.event_type.toLowerCase().includes(searchLower) ||
            grade.title.toLowerCase().includes(searchLower)
        );
    });


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentGrades = filteredGrades.slice(indexOfFirstItem, indexOfLastItem);

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
            <p className={styles.breadcrumb}>Gradebook</p>

            <div className={styles.taskHeader}>
                <h5>Gradebook</h5>
                <div className={styles.buttons}>
                    <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                </div>
            </div>


            <div className={styles.overviews}>
                
                <div className={styles.eachOverview}>
                    <div className={styles.overviewText}>
                        Total <br /> Grades
                        <div className={styles.blueBox}><img src={getImageUrl('assignment.png')} /></div>
                    </div>
                    <h4>{grades.length}</h4>
                </div>

                <div className={styles.eachOverview}>
                    <div className={styles.overviewText}>
                        Pending <br /> Grades
                        <div className={styles.blueBox}><img src={getImageUrl('forStudents.png')} /></div>
                    </div>
                    <h4>{grades.filter(e => e.graded === false).length}</h4>
                </div>

                <div className={styles.eachOverview}>
                    <div className={styles.overviewText}>
                        Completed <br />Grades
                        <div className={styles.blueBox}><img src={getImageUrl('teachersIcon.png')} /></div>
                    </div>
                    <h4>{grades.filter(e => e.graded === true).length}</h4>
                </div>
            </div>



            <div className={styles.search}>
                <img src={getImageUrl('searchIcon.png')} alt="" />
                <input onChange={handleSearch} type="text" placeholder="Search by course, title or type" />
            </div>

            <div className={styles.tasks}>
                <h3>Grades</h3>

                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :
            
                    filteredGrades.length === 0 ?
                        
                        <p className={styles.none}>No Grades Found</p>
                        :
                        <>
                        <table className={styles.tasksTable} ref={scroll}>
                            <thead>
                                <th className={styles.checkbox}><input type="checkbox" /></th>
                                <th>Course</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Submitted Date</th>
                                <th>Grade</th>
                            </thead>
                            <tbody>
                                {currentGrades.map((grade, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{grade.course_name}</td>
                                        <td>{grade.title}</td>
                                        <td>{grade.event_type}</td>
                                        <td>{format(new Date(grade.submitted_date), 'MMMM d, yyyy hh:mm:ss a')}</td>
                                        <td>
                                            <div className={grade.graded === true ? styles.graded : styles.pending}>
                                                <div></div>
                                                {grade.graded === true ? 
                                                    grade.grade + (grade.total_score !== null ?
                                                        (' / ' +  grade.total_score) : '') : 'Pending'}
                                            </div>
                                        </td>
                                        {/* <td>
                                            <button className={styles.actionsButton} onClick={(e) => toggleAction(e, index)}>
                                                <img src={getImageUrl('threeDots.png')} alt="" />
                                            </button>
                                            {actionsOpen[index]&& <div className={styles.theActions} ref={actionsRef}>
                                                <h5>ACTION</h5>
                                                {/* <button><img src={getImageUrl('edit.png')} />VIEW GRADE</button> *
                                                <button><img src={getImageUrl('edit.png')} />GRADE GRADE</button>
                                                <button onClick={()=>handleDownload(grade)}><img src={getImageUrl('approve.png')} />DOWNLOAD</button>
                                            </div>}
                                        </td> */}
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
                                currentData={filteredGrades}
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