import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./CohortPage.module.css";
import axios from 'axios';
import { format } from "date-fns";
import Modal from "../../Components/Modals/Modal";
import { BASE_URL, TEST_URL } from "../../../../config";

export const CohortPage = () => {

    const [ cohorts, setCohorts ] = useState([]);
    const [ isOpenCohort, setIsOpenCohort ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isLoading2, setIsLoading2 ] = useState(false);


    useEffect(() => {
        fetchCohorts();
    }, []);

    const fetchCohorts = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/cohorts-details", {
                timeout: 20000
            });
            setCohorts(result.data);
            console.log(result);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            // setErrorMessage(true);
        }
    }
    

    const [ newCohortValues, setNewCohortValues ] = useState({
        name: '',
        cohort_number: '',
        description: '',
        start_date: '',
        end_date: '',
        year: new Date().toISOString().slice(0,4),
        date_added: new Date().toISOString().slice(0, 19).replace('T', ' '),
        user: sessionStorage.getItem('full_name'),
    })

    const handleInput = (event) => {
        setNewCohortValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
        if (event.target.name === 'end_date') {
            setNewCohortValues(prev => ({...prev, 'year': new Date(event.target.value).toISOString().slice(0,4)}))
        }
    }
    const handleSubmitCohort = async (event) => {
        event.preventDefault();
        setIsLoading2(true);


        try {
            axios.post(BASE_URL + '/new-cohort', newCohortValues)
            .then(res => {
                console.log(res);
                setIsOpenCohort(false);
                handleSuccess();
                fetchCohorts();
            })
        } catch (err) {
            console.log(err);
            setIsLoading2(true);
        }
    }

    const handleSuccess = () => {
        // setOpenSuccess(true);
        // setTimeout(() => setOpenSuccess(false), 3000);
        // setTimeout(() => fetchCoursesTeachersStudents(), 3000);
    }

    function handleViewCohort(id) {
        window.location.href = `/admin-dashboard/cohort/${id}`;
    }


    return (
        <>

        <div className={styles.whole}>

            <div className={styles.breadcrumb}><a href="/admin-dashboard/overview">Home</a> {'>'} Cohorts</div>

            <div>
                <div className={styles.title}>
                    <h3>All Cohorts</h3>
                    <div className={styles.buttons}>
                        <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} alt="" /></button>
                        <button
                            className={styles.buttonTwo}
                            onClick={()=>setIsOpenCohort(true)}
                            // disabled={cohorts?.length >= 3 ? true : false}
                        >
                            <img src={getImageUrl('whitePlus.png')} alt="" />
                            Add New Cohort
                        </button>
                    </div>
                </div>

                {isLoading ? <h5 className={styles.loading}>Loading...</h5> :
                
                    cohorts.length === 0 ?
                        
                        <p className={styles.none}>No Cohorts Found</p>
                        :
                        <div className={styles.cohorts}>

                            {cohorts.map((coho, index) => (
                                <div className={styles.cohortBox} key={index}>
                                    <div className={styles.infoHeader}>
                                        <div>
                                            <h3>{coho.cohort_name}</h3>
                                            <p>{coho.description}</p>
                                        </div>
                                        <div className={styles.number}>{coho.cohort_number}</div>
                                    </div>
                                    <div className={styles.cohortData}>
                                        <div>
                                            <img src={getImageUrl('blueCalendar.png')} alt="" />
                                            {format( new Date(coho.start_date), 'MMMM')} - {format( new Date(coho.end_date), 'MMMM')} {format( new Date(coho.end_date), 'yyyy')}
                                        </div>
                                        <div>
                                            <img src={getImageUrl('forStudents.png')} alt="" />
                                            {coho.course.reduce((sum, item) => sum + item.student_count, 0)} Students
                                        </div>
                                    </div>
                                    <div className={styles.cohortLoader}>
                                        <p>{coho.course.filter(e => e.completed === true).length}/{coho.course.length}</p>
                                        <progress
                                            id="progress"
                                            className={`${coho.course.filter(e => e.completed === true).length === coho.course.length ? styles.complete : ''} ${styles.progress}`}
                                            max={coho.course.length}
                                            value={coho.course.filter(e => e.completed === true).length}
                                        />
                                    </div>
                                    <button className={styles.viewButton} onClick={()=>handleViewCohort(coho.cohort_id)}>
                                        <img src={getImageUrl('view.png')} alt="" />
                                        View
                                    </button>
                                </div>
                            ))}
                            
                        </div>
                }
            </div>
        </div>

        <Modal isOpen={isOpenCohort}>
            <div className={styles.addCohort}>
                <div className={styles.head}>
                    <h3>Create Cohort</h3>
                    <button onClick={()=>setIsOpenCohort(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                </div>

                <form onSubmit={handleSubmitCohort} className={styles.contentBody}>
                    
                    <div className={styles.flex}>

                        <div className={styles.form}>
                            <label htmlFor="title">Title</label>
                            <input type="text" name="name" id="name" placeholder="Enter cohort title" onInput={handleInput} required />
                        </div>

                        <div className={styles.form}>
                            <label htmlFor="title">Cohort Number</label>
                            <select name="cohort_number" id="cohort_number" onInput={handleInput}>
                                <option value={null}>Select which cohort</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className={styles.form}>
                        <label htmlFor="description">Description</label>
                        <textarea name="description" id="description" placeholder="Enter description" onInput={handleInput}></textarea>
                    </div>
                    
                    <div className={styles.flex}>
                        <div className={styles.form}>
                            <label htmlFor="title">Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                id="start_date"
                                min={cohorts.length > 0 && new Date(Math.max(...cohorts.map(e => new Date(e.end_date)))).toISOString().split("T")[0]}
                                onInput={handleInput}
                                required
                            />
                        </div>

                        <div className={styles.form}>
                            <label htmlFor="title">End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                id="end_date"
                                min={
                                    newCohortValues.start_date ? newCohortValues.start_date :
                                    cohorts.length > 0 && new Date(Math.max(...cohorts.map(e => new Date(e?.end_date)))).toISOString().split("T")[0]
                                }
                                onInput={handleInput}
                                required
                            />
                        </div>
                        
                    </div>
    
                    <button className={styles.cohortButton}>{isLoading2 ? "..." : "Submit"}</button>

                </form>


            </div>
        </Modal>
        </>
    )
}