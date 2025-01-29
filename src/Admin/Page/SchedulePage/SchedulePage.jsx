import React, { useEffect, useRef, useState } from "react";
import styles from './SchedulePage.module.css';
import { getImageUrl } from "../../../utilis";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from "../../Components/Modals/Modal";
import { format } from 'date-fns';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";
import { customToast } from "../../../Components/Notifications";


export const SchedulePage = () => {

    const [ events, setEvents ] = useState([]);
    const [ allCourses, setAllCourses ] = useState([]);
    const [ allLessons, setAllLessons ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isLoading2, setIsLoading2 ] = useState(false);
    const [ search, setSearch ] = useState("");
    const [ viewType, setViewType ] = useState('timeGridWeek');
    const [ open, setOpen ] = useState(false);
    const [ openSuccess, setOpenSuccess ] = useState(false);
    const [ eventType, setEventType ] = useState("");
    const calendarRef = useRef(null);
    const calendarAPI = calendarRef?.current?.getApi();

    useEffect(() => {
        fetchEvents();
        fetchAllCourses();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/events", {
                timeout: 25000
            });
            setEvents(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            customToast("We're having trouble getting your events. Please try again later")
        }
    }

    const fetchAllCourses = async () => {
        try {
            const result = await axios(BASE_URL + `/courses`);
            setAllCourses(result.data)
        } catch (err) {
            console.log(err);
        }
    }

    const fetchAllLessons = async (Id) => {
        try {
            const result = await axios(BASE_URL + `/lessons-course/${Id}`);
            setAllLessons(result.data)
        } catch (err) {
            console.log(err);
        }
    }


    const [ newEventValues, setNewEventValues ] = useState({
        name: null,
        type: null,
        course_id: null,
        course_name: null,
        lesson_id: null,
        start_date: null,
        end_date: null,
        due_date: null
    })
    
    const handleClose = () => {
        setOpen(false);
        setNewEventValues({
            name: null,
            type: null,
            course_id: null,
            course_name: null,
            lesson_id: null,
            start_date: null,
            end_date: null,
            due_date: null
        })
    };
    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        calendarChangeView(viewType);
    }, [viewType, calendarAPI]);

    const calendarChangeView = (type) => {
        calendarAPI?.changeView(type);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredEvents = events.filter(event => {
        const searchLower = search.toLowerCase();
        return (
            event.title.toLowerCase().includes(searchLower) ||
            event.event_type.toLowerCase().includes(searchLower) ||
            event.course_name.toLowerCase().includes(searchLower)
        );
    });


    const handleInput = (event) => {

        setNewEventValues(prev => ({ ...prev, [event.target.name]: event.target.value }))

        if ((event.target.name === 'due_date')
        || (event.target.name === 'start_date')
        || (event.target.name === 'end_date')) {
            setNewEventValues(prev => ({ ...prev, [event.target.name]: event.target.value.replace('T', ' ') + '+01' }))
        }
        
        if (event.target.name === 'type' && event.target.value === 'Assignment' && newEventValues.course_id) {
            fetchAllLessons(newEventValues.course_id);
        }
        if (event.target.name === 'course_id' && newEventValues.type === 'Assignment') {
            fetchAllLessons(event.target.value);
        }
    }
    const handleSubmitEvent = async (event) => {
        event.preventDefault();
        setIsLoading2(true);
        try {

            var response = '';

            if (newEventValues.type === 'Class') {
                response = await axios.post(BASE_URL + '/new-lesson', newEventValues);
                setIsLoading2(false);
                handleSuccess('Class');
            }
            else if (newEventValues.type === 'Assignment') {
                response = await axios.post(BASE_URL + '/new-assignment', newEventValues);
                setIsLoading2(false);
                handleSuccess('Assignment');
            }
            else if (newEventValues.type === 'Exam') {
                response = await axios.post(BASE_URL + '/new-exam', newEventValues);
                setIsLoading2(false);
                handleSuccess('Exam');
            }
            setOpen(false);
            
        } catch (err) {
            console.log(err);
            setIsLoading2(false);
        }
    }


    const handleSuccess = (type) => {
        setEventType(type);
        setOpenSuccess(true);
        setTimeout(() => setOpenSuccess(false), 3000);
        setTimeout(() => fetchEvents(), 3000);
    }



    return (
        <>
        <div className={styles.whole}>

            <a>Schedule</a>

            <div className={styles.scheduleHeader}>
                Recent Schedules

                <div className={styles.buttons}>
                    <button className={styles.buttonOne}>Sort By<img src={getImageUrl('sortIcon.png')} /></button>
                    <button className={styles.buttonTwo} onClick={handleOpen}><img src={getImageUrl('whitePlus.png')} />Create Event</button>
                </div>
            </div>

            <Modal isOpen={open} >
                <form className={styles.course_modal} onSubmit={handleSubmitEvent}>
                    <div className={styles.head}>
                        <h3>Create Event</h3>
                        <button onClick={handleClose} className={styles.close}><img src={getImageUrl('close.png')} alt="" /></button>
                    </div>

                    <div style={{overflow: 'auto'}}>
                        <div className={styles.content}>
                            <div>
                                <h5>Event Name</h5>
                                <input type="text" name="name" placeholder="Enter Event Name" onChange={handleInput} required></input>
                            </div>
                            <div>
                                <h5>Event Type</h5>
                                <select name="type" onChange={handleInput} required>
                                    <option className={styles.first} value="">Select Event Type</option>
                                    <option value="Class">Class</option>
                                    <option value="Assignment">Assignment</option>
                                    <option value="Exam">Exam</option>
                                </select>
                            </div>

                            <div>
                                <h5>Course</h5>
                                <select name="course_id" onChange={handleInput} required>
                                    <option className={styles.first} value="">Select Course</option>
                                    {allCourses.map((cours, index) => (
                                        <option key={index} value={cours.course_id}>{cours.name}</option>
                                    ))}
                                </select>
                            </div>

                            {newEventValues.type === 'Assignment' && newEventValues.course_id && <div>
                                <h5>Lesson</h5>
                                <select name="lesson_id" onChange={handleInput} required>
                                    <option value={null}>Select Lesson</option>
                                    {allLessons.map((less, index) => (
                                        <option key={index} value={less.lesson_id}>{less.title}</option>
                                    ))}
                                </select>
                            </div>}

                        </div>
                        {newEventValues.type === 'Class' && <div className={styles.contain}>
                            <div>
                                <h5>Start Date & Time</h5>
                                <input type="datetime-local" name="start_date" onChange={handleInput} />
                            </div>
                            <div>
                                <h5>End Date & Time</h5>
                                <input type="datetime-local" name="end_date" onChange={handleInput}/>
                            </div>
                        </div>}

                        {newEventValues.type != 'Class' && <div className={styles.contain}>
                            <div>
                                <h5>Due Date & Time</h5>
                                <input type="datetime-local" name="due_date" onChange={handleInput}/>
                            </div>
                        </div>}
                    </div>

                    <button className={styles.submit}>{isLoading2 ? '...' : 'Submit'}</button>

                </form>
            </Modal>


            {isLoading ? <p className={styles.loading}>Loading Schedule...</p> :
                <div className={styles.biggerDiv}>

                    <div className={styles.bigDiv}>

                        <div className={styles.calendarHeader}>
                            <div className={`${styles.buttons} ${styles.move}`}>
                                <button className={styles.prev} onClick={() => calendarAPI?.prev()}><img src={getImageUrl('prevIcon.png')} /></button>
                                <button className={styles.today} onClick={() => calendarAPI?.today()}>Today</button>
                                <button className={styles.next} onClick={() => calendarAPI?.next()}><img src={getImageUrl('nextIcon.png')} /></button>
                            </div>

                            <div className={styles.buttons}>
                                <button className={viewType === 'timeGridDay' ? styles.activeGrid : styles.grid} onClick={() => setViewType('timeGridDay')}>Day</button>
                                <button className={viewType === 'timeGridWeek' ? styles.activeGrid : styles.grid} onClick={() => setViewType('timeGridWeek')}>Week</button>
                                <button className={viewType === 'dayGridMonth' ? styles.activeGrid : styles.grid} onClick={() => setViewType('dayGridMonth')}>Month</button>
                                <button className={viewType === 'dayGridYear' ? styles.activeGrid : styles.grid} onClick={() => setViewType('dayGridYear')}>Year</button>
                            </div>

                            <div className={styles.search}>
                                <img src={getImageUrl('searchIcon.png')} alt="" />
                                <input onChange={handleSearch} type="text" placeholder="Search" />
                            </div>
                        </div>

                        {viewType === 'dayGridMonth' && <div className={styles.monthHeader}>
                            {/* {calendarAPI?.getDate().toLocaleString("default", { month: "long" })} */}
                        </div>}

                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            ref={calendarRef}
                            initialView={'timeGridWeek'}
                            allDaySlot={false}
                            headerToolbar={false}
                            slotEventOverlap={false}
                            eventOverlap={false}
                            events={filteredEvents}
                            startParam="start"
                            endParam="end"
                            eventBorderColor="transparent"
                            dayHeaderContent={(args) => {
                                const { date, view } = args;
                                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                                const dayOfMonth = date.getDate();
                                // const month = date.toLocaleDateString('en-US', { month: 'short' });

                                const isDayGridView = view.type.startsWith('dayGrid');

                                return (
                                    <div className={styles.dayHeader}>
                                        {/* {isDayGridView && <h2>{month}</h2>} */}
                                        <h1>{dayOfWeek.toUpperCase()}</h1>
                                        {!isDayGridView && <h2>{dayOfMonth}</h2>}
                                    </div>
                                );
                            }}
                            eventDidMount={(info) => {
                                const eventType = info.event.extendedProps.event_type;

                                info.el.style.padding = '4px';
                                info.el.style.fontSize = '12px';
                                info.el.style.fontWeight = 500;
                                info.el.style.textOverflow = 'ellipses';

                                if (eventType.toLowerCase() === 'lesson') {
                                    info.el.style.backgroundColor = '#0EA5E91A';
                                    info.el.style.borderLeft = '3px solid #0EA5E9';
                                    info.el.classList.add('class-event');
                                }
                                else if (eventType.toLowerCase() === 'assignment') {
                                    info.el.style.backgroundColor = '#10B9811A';
                                    info.el.style.borderLeft = '3px solid #10B981';
                                    info.el.classList.add('assignment-event');
                                }
                                else {
                                    info.el.style.backgroundColor = '#8B5CF61A';
                                    info.el.style.borderLeft = '3px solid #8B5CF6';
                                    info.el.classList.add('other-event');
                                }
                            }}
                        />

                    </div>
                </div>
            }
        </div>

        <Modal isOpen={openSuccess}>
            <div className={styles.added}>
                {eventType} ADDED!
            </div>
        </Modal>
        </>
    )
}