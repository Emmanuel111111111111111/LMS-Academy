import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../../App.module.css';
import { AdminHeader } from '../Components/AdminHeader/AdminHeader';
import { AdminNavbar } from '../Components/AdminNavbar/AdminNavbar';

export const AdminDashboardLayout = () => {
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