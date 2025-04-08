import React, { useEffect, useRef, useState } from "react";
import { getImageUrl } from "../../../utilis";
import styles from "./Classes.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Modal from "../../Components/Modals/Modal";
import Calendar from 'react-calendar';
import "../../../App.css"
import { customToast } from "../../../Components/Notifications";
import { BASE_URL, TEST_URL } from "../../../../config";


export const ClassDetails = () => {

    const { id } = useParams();

    const [ theClass, setClass ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ charCount, setCharCount ] = useState(theClass?.description != null ? (255 - theClass.description.length) : 255);
    const [ showFileName, setShowFileName ] = useState(false);
    const [ selectedFiles, setSelectedFiles ] = useState([]);
    const [ fileNames, setFileNames ] = useState([]);
    const [ actionsOpen, setActionsOpen ] = useState({});
    const [ isOpenAssignment, setIsOpenAssignment ] = useState(false);
    const [ isEditAssignment, setIsEditAssignment ] = useState(false);
    const [ item, setItem ] = useState('');
    const [ selected, setSelected ] = useState({});
    const [ confirmType, setConfirmType ] = useState('');
    const [ isOpenConfirm, setIsOpenConfirm ] = useState(false);
    const [ fileName, setFileName ] = useState('');
    const [ titleErrorMsg, setTitleErrorMsg ] = useState(false);

    const navigate = useNavigate();
    const actionsRef = useRef(null);

    useEffect(() => {
        loadLessonDetails();
    }, [id]);

    const loadLessonDetails = async () => {
        setIsLoading(true);
        try {
            if (sessionStorage.getItem("role") === 'Teacher') {
                const result = await axios(TEST_URL + `/all-lesson-info/${sessionStorage.getItem("id")}`);
                if (result.data.filter(e => e.lesson_id === parseInt(id)).length === 0) {
                    window.location.href = "/admin-dashboard/classes"
                }
                else { setClass(result.data.filter(e => e.lesson_id === parseInt(id))[0]); }
            }
            else if (sessionStorage.getItem("role") === 'Admin') {
                const result = await axios(TEST_URL + `/all-lesson-info`);
                if (result.data.filter(e => e.lesson_id === parseInt(id)).length === 0) {
                    window.location.href = "/admin-dashboard/classes"
                }
                else {
                    setClass(result.data.filter(e => e.lesson_id === parseInt(id))[0]);
                    console.log(result.data.filter(e => e.lesson_id === parseInt(id))[0]);
                }
            }
            
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            customToast("We're having trouble getting the class details. Try again later.")
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClass((prevClass) => ({
            ...prevClass,
            [name]: value,
        }));

        if (name === 'files') {
            const files = Array.from(e.target.files);
            setShowFileName(true);
            files.forEach((file) => {
                fileNames.push(file.name);
                selectedFiles.push(file);
            });
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
            selectedFiles.forEach((file) => {
                formData.append('files', file);
            });
        }
        try {
            const response = await fetch(BASE_URL + `/lesson-info`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                customToast('Class updated successfully');
                // loadLessonDetails();
                navigate('/admin-dashboard/classes');
            } else {
                console.error("Failed to update class");
                customToast('Error updating class. Please try again');
            }
        } catch (error) {
            console.log('Error updating class:', error);
            customToast('Error updating class. Please try again');
        }
    };

    const handleCancel = () => {
        // setClass(location.state);
        navigate('/admin-dashboard/classes');
    }

    const deleteFile = async (id) => {
        const deleteValues = {
            lesson_id: theClass.lesson_id,
            file_id: id,
        }

        try {
            const result = await axios.post(BASE_URL + '/delete-lesson-file', deleteValues)
            loadLessonDetails();
            setActionsOpen({});
        } catch (error) {
            console.log('Error deleting file', error);
            customToast('Unable to delete file. Try again later')
        }
    }


    const [ newAssignment, setNewAssignment ] = useState({
        name: null,
        lesson_id: null,
        due_date: null,
        total_score: null,
        file: null
    })
    const newAssignmentInput = (event) => {
        setNewAssignment(prev => ({ ...prev, 'lesson_id': theClass.lesson_id }));
        setNewAssignment(prev => ({ ...prev, [event.target.name]: event.target.value }))

        if (event.target.name === 'due_date') {
            setNewAssignment(prev => ({ ...prev, [event.target.name]: event.target.value.replace('T', ' ') + '+01' }))
        }

        if (event.target.name === 'file') {
            setNewAssignment(prev => ({ ...prev, [event.target.name]: event.target.files }))
            setShowFileName(true);
            setFileName(event.target.files[0].name);
        }
    }
    const handleNewAssignment = async (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        if (!newAssignment.name.trim()) {
            setTitleErrorMsg(true);
            return;
        }

        const formData = new FormData();
        formData.append('lesson_id', newAssignment.lesson_id);
        formData.append('name', newAssignment.name);
        formData.append('due_date', newAssignment.due_date);
        formData.append('total_score', newAssignment.total_score);
        newAssignment.file !== null && formData.append('file', newAssignment.file[0]);

        try {
            const response = await fetch(BASE_URL + '/new-assignment', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                customToast('Assignment added successfully');
                loadCourseDetails();
            } else {
                console.error("Failed to add assignment");
                customToast('Error adding assignment. Please try again');
            }
        } catch (error) {
            console.error('Error adding assignment:', error);
            customToast('Error adding assignment');
        }
        setIsOpenAssignment(false);
        setShowFileName(false);
        setFileName('');
        setNewAssignment({
            name: null,
            course_id: null,
            start_date: null,
            end_date: null,
            total_score: null,
            file: null
        });
    };

    const editAssignmentInput = (event) => {
        setSelected(prev => ({ ...prev, [event.target.name]: event.target.value }))

        if ((event.target.name === 'start_date')
        || (event.target.name === 'end_date')) {
            setSelected(prev => ({ ...prev, [event.target.name]: event.target.value.replace('T', ' ') + '+01' }))
        }

        if (event.target.name === 'file') {
            console.log('here we are')
            setSelected(prev => ({ ...prev, [event.target.name]: event.target.files }))
            setShowFileName(true);
            setFileName(event.target.files[0].name);
            console.log(event.target.files);
        }
    }
    const handleEditAssignment = async (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        if (!selected.assignment_name.trim()) {
            setTitleErrorMsg(true);
            return;
        }

        const formData = new FormData();
        formData.append('assignment_name', selected.assignment_name);
        formData.append('due_date', selected.due_date);
        formData.append('total_score', selected.total_score);
        formData.append('assignment_id', selected.assignment_id);
        selected.file !== null && formData.append('file', selected.file[0]);

        try {
            const response = await fetch(BASE_URL + '/update-assignment', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                loadCourseDetails();
                customToast('Assignmnet updated successfully');
            } else {
                console.error("Failed to add assignment");
                customToast('Error adding assignment. Please try again');
            }
        } catch (error) {
            console.error('Error while updating assignment:', error);
            customToast('Error while updating assignment');
        }
        setIsEditAssignment(false);
        setShowFileName(false);
        setFileName('');
        setSelected({});
    };


    const toggleAction = (event, index) => {
        event.stopPropagation();
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


    return(
        <div className={styles.whole}>
            
            {(isLoading) ? <p className={styles.loading}>Loading...</p> :

                <>
                <div className={styles.breadcrumb}><a href="/admin-dashboard/classes">Classes</a> {'>'} {theClass.title}</div>

                <form onSubmit={handleSubmit} encType="multipart/form-data">


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
                                            {fileNames.map((fil, i) => (
                                                <p key={i}>{fil}</p>
                                            ))}
                                        </div>}

                                        <label className={styles.uploadButton}>
                                            Browse Files
                                            <input type="file" name="files" id="files" multiple accept="image/png, image/jpeg, application/pdf" onChange={handleInputChange} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.box}>
                                <div className={styles.flexHeader}>
                                    <h5>Content</h5>
                                    <button type="button" onClick={()=>setIsOpenAssignment(true)}>+ Add new assignment</button>
                                </div>
                                {theClass.lesson_files && theClass.lesson_files.map((file, i) => (
                                    <div className={styles.section} key={i}>
                                        <div className={styles.text}>
                                            {file.file_name}
                                        </div>
                                        <div>
                                            <button  type="button" className={styles.actionsButton} onClick={(e) => toggleAction(e, i)}><img src={getImageUrl('threeDots.png')} /></button>
                                            {actionsOpen[i] && <div className={styles.theActions} ref={actionsRef}>
                                                <h5>ACTION</h5>
                                                <button type="button" onClick={()=>deleteFile(file.file_id)}><img src={getImageUrl('delete.png')} />DELETE</button>
                                            </div>}
                                        </div>
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

            <Modal isOpen={isOpenAssignment}>
                <div className={styles.addContent}>
                    <div className={styles.head}>
                        <h3>Add Assignment</h3>
                        <button onClick={()=>setIsOpenAssignment(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                    </div>
                    <form className={styles.contentBody}>
            
                        {titleErrorMsg && <p style={{color: 'red', fontSize: '12px'}}>Title can't be empty</p>}
                        <label htmlFor="title">Title</label>
                        <input type="text" name="name" id="title" placeholder="Enter title" onChange={newAssignmentInput} />

                        <label>Total Marks</label>
                        <input type="number" name="total_scores" placeholder="Enter total possible marks" onChange={newAssignmentInput} />

                        <label>Due Date</label>
                        <input type="datetime-local" name="due_date" onChange={newAssignmentInput} />

                        <label className={styles.uploadButton}>
                            {fileName !== '' ? 'Change file' : 'Select file'}
                            <input type="file" name="file" id="file" accept="image/png, image/jpeg" onChange={newAssignmentInput} />
                        </label>

                        {fileName !== '' && fileName}

                        <button type="submit" onClick={handleNewAssignment}>Submit</button>
                    </form>
                </div>
            </Modal>

            <Modal isOpen={isEditAssignment}>
                <div className={styles.addContent}>
                    <div className={styles.head}>
                        <h3>Edit Assignment</h3>
                        <button onClick={()=>setIsEditAssignment(false)} className={styles.close}><img src={getImageUrl('close.png')} /></button>
                    </div>
                    <form className={styles.contentBody}>
            
                        {titleErrorMsg && <p style={{color: 'red', fontSize: '12px'}}>Title can't be empty</p>}
                        <label htmlFor="title">Title</label>
                        <input type="text" name="assignment_name" id="title" placeholder="Enter title" value={selected?.assignment_name} onChange={editAssignmentInput} />

                        <label>Total Marks</label>
                        <input type="text" name="total_scores" placeholder="Enter total possible marks" value={selected?.total_score} onChange={editAssignmentInput} />
                        
                        <label>Due Date</label>
                        <input type="datetime-local" name="due_date" value={selected.end_date ? new Date(selected.end_date).toISOString().slice(0, 16) : ''} onChange={editAssignmentInput} />

                        
                        <label className={styles.uploadButton}>
                            {selected.file === null ? 'Select file' : 'Change file'}
                            <input type="file" name="file" id="file" accept="image/png, image/jpeg" onChange={editAssignmentInput} />
                        </label>
                        {showFileName && fileName}


                        <button type="submit" onClick={handleEditAssignment}>Submit</button>
                    </form>
                </div>
            </Modal>
        </div>
    )
}