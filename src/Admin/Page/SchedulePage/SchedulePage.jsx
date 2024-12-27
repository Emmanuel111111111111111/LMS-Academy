import React, { useEffect, useRef, useState } from "react";
import styles from './SchedulePage.module.css';
import { getImageUrl } from "../../../utilis";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from "../ActiveCourses/Modal";
import { format } from 'date-fns';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../../config";


export const SchedulePage = () => {

    const [ events, setEvents ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ search, setSearch ] = useState("");
    const [ viewType, setViewType ] = useState('timeGridWeek');
    const [ open, setOpen ] = useState(false);
    const calendarRef = useRef(null);
    const calendarAPI = calendarRef?.current?.getApi();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + "/events", {
                timeout: 25000
            });
            setEvents(result.data);
            console.log(result.data);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    }
    
    const handleClose = () => {
        setOpen(false);
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
                <div className={styles.course_modal}>
                    <div className={styles.head}>
                        <h3>Create Event </h3>
                        <button onClick={handleClose} className={styles.close}><img src={getImageUrl('close.png')} alt="" /></button>
                    </div>

                    <div style={{overflow: 'auto'}}>
                        <div className={styles.content}>
                            <div>
                                <h5>Event Name</h5>
                                <input type="text" placeholder="Enter Event Name"></input>
                            </div>
                            <div>
                                <h5>Event Type</h5>
                                <select name="" id="">
                                    <option value="">Select Event Type</option>
                                    <option value="">Class</option>
                                    <option value="">Assignment</option>
                                    <option value="">Exam</option>
                                </select>
                            </div>

                        </div>
                        <div className={styles.contain}>
                            <div>
                                <h5>Start Date & Time</h5>
                                <input type="datetime-local" name="" id="" />
                            </div>
                            <div>
                                <h5>End Date & Time</h5>
                                <input type="datetime-local" name="" id="" />
                            </div>
                        </div>

                    </div>

                    <button className={styles.submit}>Submit</button>
                </div>
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

                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            ref={calendarRef}
                            initialView={'timeGridWeek'}
                            allDaySlot={false}
                            headerToolbar={false}
                            slotEventOverlap={false}
                            eventOverlap={false}
                            events={events}
                            startParam="start"
                            endParam="end"
                            eventBorderColor="transparent"
                            dayHeaderContent={(args) => {
                                const { date, view } = args;
                                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                                const dayOfMonth = date.getDate();

                                const isDayGridView = view.type.startsWith('dayGrid');

                                return (
                                    <div className={styles.dayHeader}>
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
        </>
    )
}