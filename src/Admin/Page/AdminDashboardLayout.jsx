import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../../App.module.css';
import { AdminHeader } from '../Components/AdminHeader/AdminHeader';
import { AdminNavbar } from '../Components/AdminNavbar/AdminNavbar';
import axios from 'axios';
import { TEST_URL } from '../../../config';


export const AdminDashboardLayout = () => {

    useEffect(() => {
        updateActiveCohort();
    });

    const updateActiveCohort = async () => {
        try {
            const result = await axios.post(BASE_URL + '/update-active');
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    }


    return (
        <>
        <AdminHeader />
        <div className={styles.withNav}>
            <AdminNavbar />
            <Outlet />
        </div>
        </>
    );
}