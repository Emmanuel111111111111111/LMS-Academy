import React, { useEffect, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./Classes.module.css";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";
import Modal from "../../Components/Modals/Modal";
import Calendar from 'react-calendar';
import "../../../App.css"


export const ClassDetails = () => {

    const { id } = useParams();

    const [ theClass, setClass ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ charCount, setCharCount ] = useState(theClass?.description != null ? (255 - theClass.description.length) : 255);

    const [ isOpenContent, setIsOpenContent ] = useState(false);
    const [ newLessonTitle, setNewLessonTitle ] = useState('');
    const [ titleErrorMsg, setTitleErrorMsg ] = useState(false);
    const [ showFileName, setShowFileName ] = useState(false);
    const [ selectedFiles, setSelectedFiles ] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        loadLessonDetails();
    }, [id]);

    const loadLessonDetails = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/lessons`, {
                timeout: 20000
            });
            setClass(result.data.filter(e => e.lesson_id === parseInt(id))[0]);
            
            if (result.data.filter(e => e.lesson_id === parseInt(id)).length != 1) {
                navigate('/404');
            }
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            // setErrorMessage(true);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClass((prevClass) => ({
            ...prevClass,
            [name]: value,
        }));

        if (name === 'lesson_data') {
            setShowFileName(true);
            selectedFiles.push(value);
        }

        if (name === 'description') {
            setCharCount(255 - value.length);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('lesson_id', theClass.lesson_id);
        formData.append('title', theClass.title);
        formData.append('description', theClass.description);
        formData.append('level', theClass.level);
        formData.append('status', theClass.status);
        if (selectedFiles && selectedFiles.length > 0) {
            for (const file of selectedFiles) {
                formData.append('files', file);
            }
        }
        try {
            const response = await fetch(BASE_URL + `/lesson-info`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Class updated successfully');
                // loadLessonDetails();
                navigate('/admin-dashboard/classes');
            } else {
                console.error("Failed to update class");
            }
        } catch (error) {
            console.log('Error updating class:', error);
        }
    };

    const handleCancel = () => {
        // setClass(location.state);
        navigate('/admin-dashboard/classes');
    }


    return(
        <div className={styles.whole}>
            
            {(isLoading) ? <p className={styles.loading}>Loading...</p> :

                <>
                <div className={styles.breadcrumb}><a href="/admin-dashboard/classes">Classes</a> {'>'} {theClass.title}</div>

                <form onSubmit={handleSubmit}>


                    <div className={styles.classTitle}>
                        <h3>{theClass.title}</h3>
                        <div className={styles.buttons}>
                            <button className={styles.button1} onClick={handleCancel} type="button">Cancel</button>
                            <button className={styles.button2} type="submit">Save</button>
                        </div>
                    </div>
                    
                    <div className={styles.grid}>
                        <div className={styles.larger}>

                            <div className={styles.box}>
                                <div className={styles.header}>
                                    <h5>Basic Info</h5>
                                    <p>Provide information about the class</p>
                                </div>
                                <div className={styles.detailForm}>
                                    <label htmlFor="title">Name</label>
                                    <input type="text" name="title" id="title" value={theClass.title} onChange={handleInputChange}/>

                                    <label htmlFor="description">Description</label>
                                    <textarea style={{width: '100%', height: '160px'}} type="text" name="description" id="description" value={theClass.description} onChange={handleInputChange}/>
                                    <p>{charCount} characters left</p>
                                </div>
                            </div>

                            <div className={styles.box}>
                                <div className={styles.header}>
                                    <h5>Upload files</h5>
                                    <p>Select and upload the files of your choice</p>
                                </div>
                                <div className={styles.uploadBox}>
                                    <div htmlFor="files" className={styles.uploadDiv}>
                                        <img src={getImageUrl('uploadDocs.png')} />
                                        <h5>Choose a file or drag & drop it here</h5>
                                        <p>JPEG, PNG, and PDF formats, up to 50MB</p>

                                        {showFileName && <div className={styles.theFiles}>Selected file(s): 
                                            {selectedFiles.map((fil, i) => (
                                                <p key={i}>{fil.replace(/^.*[\\/]/, '')}</p>
                                            ))}
                                        </div>}

                                        <label className={styles.uploadButton}>
                                            Browse Files
                                            <input name="lesson_data" type="file" accept="image/png, image/jpeg, application/pdf" onChange={handleInputChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.box}>
                                <div className={styles.flexHeader}>
                                    <h5>Content</h5>
                                </div>
                                {theClass.lessons && theClass.lessons.map((sec, i) => (
                                    <div className={styles.section} key={i}>
                                        <div className={styles.text}>
                                            <img src={getImageUrl('reorder.png')} alt="" />
                                            {sec.title}
                                        </div>
                                        <button type="button"><img src={getImageUrl('threeDots.png')} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.smaller}>

                            <div className={styles.preview}>
                                <div>
                                    <h5>Preview Class</h5>
                                    <p>View how others see this class</p>
                                </div>
                                <button type="button">Preview</button>
                            </div>

                            <div className={styles.box}>
                                <h5>Class Status</h5>
                                <div className={styles.detailForm}>
                                    <label htmlFor="">Product Status</label>
                                    <select name="" id="">
                                        <option value="">Published</option>
                                    </select>
                                    <label htmlFor="" className={styles.checkbox}>
                                        <input type="checkbox" name="" id="" />
                                        Hide this class
                                    </label>
                                </div>
                            </div>


                            <div className={styles.box}>
                                <h5>Class Level</h5>
                                <div className={styles.detailForm}>
                                    <label htmlFor="level">Level</label>
                                    <select name="level" id="level" value={theClass.level} onChange={handleInputChange}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                    <label htmlFor="" className={styles.checkbox}>
                                        <input type="checkbox" value="Special" name="" id="" />
                                        Special Class
                                    </label>
                                </div>
                            </div>


                            <div className={styles.box}>
                                <div className="calBox">
                                    <Calendar />
                                </div>
                            </div>

                        </div>

                    </div>

                </form>
                </>
            }
        </div>
    )
}