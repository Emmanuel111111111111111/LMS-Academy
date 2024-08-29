import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../App.module.css';
import { Header } from '../Components/Header/Header';
import { Navbar } from '../Components/Navbar/Navbar';

export const DashboardLayout = () => {
    return (
        <>
        <Header />
        <div className={styles.withNav}>
            <Navbar />
            <Outlet className={styles.outlet}/>
        </div>
        </>
    );
}