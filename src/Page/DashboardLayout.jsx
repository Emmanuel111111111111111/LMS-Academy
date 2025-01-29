import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../App.module.css';
import { Header } from '../Components/Header/Header';
import { Navbar } from '../Components/Navbar/Navbar';
import { BASE_URL } from '../../config';
import axios from 'axios';

export const DashboardLayout = () => {

    useEffect(() => {
        updateActiveCohort();
    });

    const updateActiveCohort = async () => {
        try {
            const result = await axios.post(BASE_URL + '/update-active');
            console.log(result.status);
        } catch (err) {
            console.log(err);
        }
    }


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