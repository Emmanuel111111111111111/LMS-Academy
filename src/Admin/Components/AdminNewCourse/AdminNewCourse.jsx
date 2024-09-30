/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./NewCourse.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import './Calendar.css';
 import Modal from '../AdminCourse/Modal';

export const AdminNewCourse = () => {
    const [date, setDate] = useState(new Date());
    const [ isOpen, setIsOpen ] = useState(false);
    const handleClose= () => {
        setIsOpen(false);
    };
    const handleOpen = () => {
        setIsOpen(true);
    };
    return(
        <>
         <div className={styles.whole}>
            <h5>Course <img src={getImageUrl('Icons12.png')} /><a>New course</a><img src={getImageUrl('Icons12.png')} /><a>Name of Course</a></h5>
            <div>
                <div className={styles.title}>
                    <h1>Name of Course</h1>
                    <div className={styles.buttons}>
                        <button className={styles.button1}>Cancel</button>
                        <button className={styles.button2}><img src={getImageUrl('Save.png')}/>Save</button>
                    </div>
                </div>
                <div className={styles.main}>
                    <div className={styles.left}>
                        <div className={styles.leftcontent}>
                                <div className={styles.basicinfo}>
                                    <h3>Basic Info</h3>
                                    <p> Provide information about the course</p>
                                </div>
                                <div className={styles.info}>
                                    <div className={styles.name}>
                                        <h5>Name</h5>
                                        <input placeholder="Name of Course"></input>
                                    </div>
                                    <div className={styles.description}>
                                        <h5>Description</h5>
                                        <div className={styles.describe}>
                                            <div className={styles.text}>
                                                <h5>Normal Text </h5>
                                                <img src={getImageUrl('keyboard_arrow_down (black).png')}/>
                                                <img className={ styles.edit} src={getImageUrl('Textedit.png')}/>
                                            </div>
                                            
                                            <input placeholder="Expand your knowledge with our interactive courses."></input>
                                        </div>
                                        <p>256 characters left</p>
                                    </div>
                                </div>
                        </div>
                        <div className={styles.uploadfiles}>
                                <div className={styles.files}>
                                    <h3>Uplaod Files</h3>
                                    <p> Provide information about the course</p>
                                </div>
                                <div className={styles.upload}>
                                    <img src={getImageUrl('upload.png')}/>
                                    <h5>Choose a file or drag & drop it here</h5>
                                    <p>JPEG, PNG, PDG, and MP4 formats, up to 50MB</p>
                                    <button>Browse Files</button>
                                </div>
                        </div>
                        <div className={styles.content}>
                                <div className={styles.coursehead}>
                                    <h3>Content</h3>
                                    <a><img src={getImageUrl('bluePlus.png')}/>Add new Content</a>
                                </div>
                                <div className={styles.coursecontent}>
                                   <img src={getImageUrl('menu.png')}/>
                                   <p>Week 1- beginner - Introduction  to Python</p>
                                   <button><img src={getImageUrl('threeDots.png')}/></button>
                                </div>
                                <div className={styles.coursecontent}>
                                   <img src={getImageUrl('menu.png')}/>
                                   <p>Week 1- beginner - Introduction  to Python</p>
                                   <button><img src={getImageUrl('threeDots.png')}/></button>
                                </div>
                                <div className={styles.coursecontent}>
                                   <img src={getImageUrl('menu.png')}/>
                                   <p>Week 1- beginner - Introduction  to Python</p>
                                   <button><img src={getImageUrl('threeDots.png')}/></button>
                                </div>
                                <div className={styles.coursecontent}>
                                   <img src={getImageUrl('menu.png')}/>
                                   <p>Week 1- beginner - Introduction  to Python</p>
                                   <button><img src={getImageUrl('threeDots.png')}/></button>
                                </div>
                                <div className={styles.coursecontent}>
                                   <img src={getImageUrl('menu.png')}/>
                                   <p>Week 1- beginner - Introduction  to Python</p>
                                   <button><img src={getImageUrl('threeDots.png')}/></button>
                                </div>
                        </div>
                    </div>
                    <div className={styles.mainright}>
                            <div className={styles.right}>
                                    <div className={styles.preview}>
                                        <div className={styles.Tpreview}>
                                        <h2>Preview Course</h2>
                                        <button>Preview</button>
                                        </div>
                                        <p>View how others see your course</p>
                                        
                                    </div>
                                    <div className={styles.coverpic}>
                                        <img src={getImageUrl('uploadpic.png')}/>
                                        <h5>Upload Cover Picture</h5>
                                        <p>JPEG or PNG </p>
                                        <button>Browse Files</button>
                                    </div>
                                    <div className={styles.coverstatus}>
                                        <h2>Cover Status</h2>
                                        <div className={styles.info}>
                                            <h5>Product Status</h5>
                                            <button>Published <img src={getImageUrl('keyboard_arrow_down (black).png')}/></button>
                                            <div>
                                            <input type="checkbox"/><p>Hide this course </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.coverlevel}>
                                        <h3>Cover Level</h3>
                                        <div className={styles.info}>
                                            <h5>Level</h5>
                                            <button>Beginner<img src={getImageUrl('keyboard_arrow_down (black).png')}/></button>
                                                <div>
                                                <input type="checkbox"/><p>Speacial Course</p>
                                                </div>
                                        </div>
                                    </div>
                                    <div className={styles.cohort}>
                                            <div className={styles.cohortcontent}>
                                                <h3>Cohort</h3>
                                                <button onClick={handleOpen}><img src={getImageUrl('bluePlus.png')}/>Add new Content</button>
                                                <Modal isOpen={isOpen}>
                                                    <>
                                                            <div className={styles.course_modal}>
                                                                <div className={styles.head}>
                                                                    <h3>Creat Cohort</h3>
                                                                    <button onClick={handleClose} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                                                                </div>
                                                                <div className={styles.contents}>
                                                                    <div>
                                                                        <h5></h5>
                                                                        <input type="text" placeholder="Enter Event Name"></input>
                                                                    </div>
                                                                    <div>
                                                                        <h5></h5>
                                                                        <select name="" id="" >
                                                                            <option value="">Select Event Type</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className={styles.contain}>
                                                                    <div>
                                                                        <h5>Start Date & Time</h5>
                                                                        <input type="datetime-local" name="" id="" />
                                                                    </div>
                                                                    <div>
                                                                        <h5>Due Date</h5>
                                                                        <input type="date" name="" id="" />
                                                                    </div>
                                                                </div>
                                                                <button className={styles.submit}>Submit</button>
                                                            </div>
                                                    </>
                                                </Modal>
                                            </div>
                                            <div className={styles.info}>
                                                <h5>Level</h5>
                                                <button>Beginner<img src={getImageUrl('keyboard_arrow_down (black).png')}/></button>
                                                    <div>
                                                    <input type="checkbox"/><p>Universal Level</p>
                                                    </div>
                                             </div>
                                    </div>
                                    <div className={styles.calendar}>
                                        <div className={styles.reactcalendar }>
                                            <Calendar className={styles.react-Calendar } onChange={setDate} value={date} />
                                        </div>
                                    </div>
                            </div>
                    </div>
                </div>
            </div>
        </div> 
        </>
    )
}