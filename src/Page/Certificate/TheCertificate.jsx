import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../utilis";
import styles from "./Certificate.module.css";
import { useParams } from "react-router-dom";
import axios from 'axios';
import { customToast } from "../../Components/Notifications";
import { BASE_URL, TEST_URL } from "../../../config";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


export const TheCertificate = () => {

    const [ certificate, setCertificate ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const { certId } = useParams();
    
    
    useEffect(() => {
        fetchCertificate();
        if (!isLoading) {
            setTimeout(() => {
                generatePDF();
            }, 1000);
        }
    }, []);


    const fetchCertificate = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/certificates/${sessionStorage.getItem("id")}`, {
                timeout: 25000
            });
            setCertificate(result.data.filter(e => e.certificate_id === parseInt(certId))[0]);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            customToast("We're having trouble fetching your certificate. Please try again later.")
            setIsLoading(false);
        }
    }

    const generatePDF = () => {
        const input = document.getElementById('certificate');
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
    
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: 'a4'
            });
    
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
    
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${certificate?.course_name}_certificate.pdf`);
        });
    };
    

    return (

        <div className={styles.wholeCert} id="certificate">
            {isLoading ? <p>Loading...</p> : 
            <>
                <img className={styles.img1} src={getImageUrl('cert2.svg')} />
                <div className={styles.certBody}>
                    <img src={getImageUrl('certHeader.svg')} alt="" />
                    <h4>This certificate is proudly presented to</h4>

                    <h1>{certificate?.student_name}</h1>

                    <h4>for successfully completing the {certificate?.course_name} course organized by CWG Academy.</h4>

                    <p>This certificate is awarded in recognition of their dedication, creativity, and excellence in mastering User Interface and User Experience design principles.</p>

                    <div className={styles.footer}>
                        <div>
                            <h3>{certificate?.instructors?.length > 0 ? certificate?.instructors[0].full_name : 'CWG Academy'}</h3>
                            <p>Course Instructor</p>
                        </div>

                        <img src={getImageUrl('blue_cwg.svg')} alt="CWG" />

                        <div>
                            <h3>Adewale Adeyipo</h3>
                            <p>Program Director</p>
                        </div>
                    </div>

                </div>
                <img className={styles.img2} src={getImageUrl('cert1.svg')} />
            </>}
        </div>
    )
}
