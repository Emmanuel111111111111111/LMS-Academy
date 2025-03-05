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
    const [ isLoading, setIsLoading ] = useState(false);

    const scroll = useRef(null);
    const actionsRef = useRef(null);

    useEffect(() => {

        const authToken = sessionStorage.getItem("role");
        const lastLogged = sessionStorage.getItem("last_logged");
        if ((!sessionStorage) || (!authToken) || (authToken != "Admin") || (!lastLogged) || (new Date() - new Date(lastLogged) >= 604800000)) {
        window.location.href = "/admin-dashboard";
        }

        fetchActivityLog();
    }, []);

    const fetchActivityLog = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/activity-log", {
                timeout: 10000
            });
            setActivities(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
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


            {isLoading ? <h5 className={styles.loading}>Loading...</h5> :
            
                currentActivities.length === 0 ?
                    
                    <p className={styles.none}>No Activites Found</p>
                    :
                    <>
                    <table className={styles.activitesTable}>
                        <thead>
                            <th className={styles.check}><input type="checkbox" /></th>
                            <th className={styles.detail}>Activities</th>
                            <th>User</th>
                            <th>Date and Time</th>
                            <th className={styles.act}>Action</th>
                        </thead>
                        <tbody>
                            {currentActivities.map((activity, index) => (
                                <tr>
                                    <td><input type="checkbox" /></td>
                                    <td>{activity.activity}</td>
                                    <td>{activity.user}</td>
                                    <td>{format(new Date (activity.date), 'MMMM dd, yyyy hh:mm a')}</td>
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
                    </>
            }
        </div>
        </>
    )
}