import React, { useEffect, useRef, useState } from "react";
import styles from './ActivityLogPage.module.css';
import { getImageUrl } from "../../../utilis";
import Pagination from "../../../Components/Pagination/Pagination"; 
import axios from 'axios';
import { format } from 'date-fns';
import { BASE_URL } from "../../../../config";


export const ActivityLogPage = () => {

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ itemsPerPage, setItemsPerPage ] = useState(5);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ activities, setActivities ] = useState([]);

    const scroll = useRef(null);
    const actionsRef = useRef(null);

    useEffect(() => {
        fetchActivityLog();
    }, []);

    const fetchActivityLog = async () => {
        try {
            const result = await axios(BASE_URL + "/activity-log");
            console.log(result);
            setActivities(result.data);
        } catch (err) {
            console.log(err);
        }
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentActivities = activities.slice(indexOfFirstItem, indexOfLastItem);

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
            <a ref={scroll}>Activity Log</a>

            <div className={styles.activitiesHeader}>
                Recent Activities

                <div className={styles.buttons}>
                    <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                    <button className={styles.buttonTwo}>Create Event<img src={getImageUrl('whitePlus.png')} /></button>
                </div>
            </div>
            
            <table className={styles.activitesTable}>
                <thead>
                    <th><input type="checkbox" /></th>
                    <th>Activities</th>
                    <th>Time and Date</th>
                    <th>Due Date</th>
                    <th>Action</th>
                </thead>
                <tbody>
                    {currentActivities.map((activity, index) => (
                        <tr>
                            <td><input type="checkbox" /></td>
                            <td>{activity.activity}</td>
                            <td>{format(new Date (activity.date), 'MMMM dd, yyyy hh:mm a')}</td>
                            <td>{activity.due_date}</td>
                            <td>
                                <button className={styles.actionsButton} onClick={()=>toggleAction(index)}><img src={getImageUrl('threeDots.png')} /></button>
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
                    currentData={activities}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                />

            </div>
        </div>
        </>
    )
}