import React, { useEffect, useRef, useState } from "react";
import styles from './StudentPage.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination";
import { format } from 'date-fns';
import axios from 'axios';
import Modal from "../../Components/Modals/Modal";
import { BASE_URL, TEST_URL } from "../../../../config";


export const StudentPage = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const scroll = useRef(null);
    const actionsRef = useRef(null);
    const [ students, setStudents ] = useState([]);
    const [ allCourses, setAllCourses ] = useState([]);
    const [ allNotCourses, setAllNotCourses ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isLoading2, setIsLoading2 ] = useState(false);
    const [ isLoading3, setIsLoading3 ] = useState(false);
    const [ isOpenCourse, setIsOpenCourse ] = useState(false);
    const [ selected, setSelected ] = useState({});
    const [ type, setType ] = useState('');
    const [ submitValues, setSubmitValues ] = useState({
        course_name: '',
        course_id: '',
        student_name: '',
        student_id: '',
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        user: sessionStorage.getItem('full_name')
    });

    
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/students", {
                timeout: 10000
            });
            setStudents(result.data);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    const fetchAllNotCourses = async (student_id) => {
        setIsLoading2(true);
        try {
            const result = await axios(BASE_URL + `/courses-not/${student_id}`, {
                timeout: 10000
            });
            setAllCourses(result.data);
            setIsLoading2(false);
        } catch (err) {
            setIsLoading2(false);
            console.log(err);
        }
    }
    const fetchAllCourses = async (student_id) => {
        setIsLoading2(true);
        try {
            const result = await axios(BASE_URL + `/courses/${student_id}`, {
                timeout: 10000
            });
            setAllCourses(result.data);
            setIsLoading2(false);
        } catch (err) {
            setIsLoading2(false);
            console.log(err);
        }
    }


    const handleAdd = (student) => {
        setSelected(student);
        setType('Add');
        fetchAllNotCourses(student.student_id);
        console.log(student);
        setIsOpenCourse(true);
    }
    const handleRemove = (student) => {
        setSelected(student);
        setType('Remove');
        fetchAllCourses(student.student_id);
        console.log(student);
        setIsOpenCourse(true);
    }

    const handleCourseInput = (event) => {
        const nameId = event.target.value.split('-');
        setSubmitValues(prev => ({ ...prev, 'course_id': nameId[0] }));
        setSubmitValues(prev => ({ ...prev, 'course_name': nameId[1] }));
        setSubmitValues(prev => ({ ...prev, 'student_name': selected.first_name || '' || ' ' || selected.last_name }));
        setSubmitValues(prev => ({ ...prev, 'student_id': selected.student_id }));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading3(true);
        console.log(submitValues);
        try {
            var response;
            if (type === 'Add') {
                response = await axios.post(BASE_URL + '/enroll-student', submitValues);
                console.log(response);

                setIsOpenCourse(false);
                // handleSuccess();

            } else if (type === 'Remove') {
                response = await axios.post(BASE_URL + '/unenroll-student', submitValues);
                console.log(response);

                setIsOpenCourse(false);
                // handleSuccess();
            }

            setIsLoading3(false);
            fetchStudents();

        } catch (err) {
            console.log(err);
            setIsLoading3(false);
        }
    }


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

    const currentDate = new Date();




    return (
        <>
        <div className={styles.whole}>
            <div className={styles.breadcrumb}><a ref={scroll}>Student</a> {'>'} All</div>

            <h3>All Students</h3>

                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :
                
                    currentStudents.length === 0 ?
                        
                        <p className={styles.none}>No Students Found</p>
                        :
                        <>
            
                        <table className={styles.studentsTable}>
                            <thead>
                                <th><input type="checkbox" /></th>
                                <th>Name</th>
                                <th>Courses</th>
                                <th>Date Added</th>
                                <th>Email</th>
                                <th>Phone Number</th>
                                <th>Status</th>
                                <th>Action</th>
                            </thead>
                            <tbody>
                                {currentStudents.map((student, index) => (
                                    <tr key={index}>
                                        <td><input type="checkbox" /></td>
                                        <td>{student.first_name} {student.last_name}</td>
                                        <td>{student.course}</td>
                                        <td>{format(new Date (student.date_added), 'MMMM dd, yyyy')}</td>
                                        <td>{student.email}</td>
                                        <td>{student.phone_number}</td>
                                        <td>
                                            <div className={new Date (student.last_logged) < new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000) ? styles.inactive : styles.active}>
                                                {new Date(student.last_logged) < new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000) ? 'Inactive' : 'Active'}
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <button className={styles.actionsButton} onClick={()=>toggleAction(index)}><img src={getImageUrl('threeDots.png')} /></button>
                                                <div className={`${styles.actionsClosed} ${actionsOpen[index] && styles.theActions}`} ref={actionsRef}>
                                                    <h5>ACTION</h5>
                                                    <button onClick={()=>handleAdd(student)}><img src={getImageUrl('approve.png')} />ADD TO COURSE</button>
                                                    <button onClick={()=>handleRemove(student)}><img src={getImageUrl('delete.png')} />REMOVE FROM COURSE</button>
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
                        </>
                }
        </div>


        <Modal isOpen={isOpenCourse}>
            <div className={styles.addCohort}>
                <div className={styles.head}>
                    <div>
                        <h3>{type} Student {type === 'Add' ? 'to' : 'from'} Course</h3>
                        <p>{selected.first_name}</p>
                    </div>
                    <button onClick={()=>setIsOpenCourse(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.contentBody}>
                    
                    {isLoading2 ?
                        <p className={styles.loading}>Loading...</p>
                    :
                        <div className={styles.form}>
                            <label htmlFor="course">Course</label>
                            <select name="course_id" id="course_id" onInput={handleCourseInput} required>
                                <option value="">Select course</option>
                                {allCourses.map((cours, index) => (
                                    <option key={index} value={cours.course_id + '-' + cours.name}>{cours.name}</option>
                                ))}
                            </select>
                        </div>
                    }
                    <button className={styles.cohortButton} type="submit">{isLoading3 ? "..." : "Submit"}</button>

                </form>


            </div>
        </Modal>
        </>
    )
}