import React, { useEffect, useRef, useState } from "react";
import styles from './Calendar.module.css';
import { getImageUrl } from "../../utilis";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import axios from 'axios';
import { BASE_URL, TEST_URL } from "../../../config";


export const CalendarPage = () => {

    const [ events, setEvents ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ studentId, setStudentId ] = useState("");
    const [ search, setSearch ] = useState("");
    const [ viewType, setViewType ] = useState('timeGridWeek');
    const calendarRef = useRef(null);
    const calendarAPI = calendarRef?.current?.getApi();


    useEffect(() => {
        console.log(sessionStorage);
        setStudentId(sessionStorage.getItem("id"));
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const result = await axios(BASE_URL + `/events/${studentId}`, {
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

    useEffect(() => {
        handleChangeView(viewType);
    }, [viewType, calendarAPI]);

    const handleChangeView = (view) => {
        calendarAPI?.changeView(view);
        setViewType(view);
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
            
            {isLoading ? <p className={styles.loading}>Loading...</p> :
                
                <div className={styles.bigDiv}>

                    <div className={styles.calendarHeader}>
                        <div className={`${styles.buttons} ${styles.move}`}>
                            <button className={styles.prev} onClick={()=>calendarAPI?.prev()}><img src={getImageUrl('prevIcon.png')} /></button>
                            <button className={styles.today} onClick={()=>calendarAPI?.today()}>Today</button>
                            <button className={styles.next} onClick={()=>calendarAPI?.next()}><img src={getImageUrl('nextIcon.png')} /></button>
                        </div>

                        <div className={styles.buttons}>
                            <button className={viewType === 'timeGridDay' ? styles.activeGrid : styles.grid} onClick={()=>handleChangeView('timeGridDay')}>Day</button>
                            <button className={viewType === 'timeGridWeek' ? styles.activeGrid : styles.grid} onClick={()=>handleChangeView('timeGridWeek')}>Week</button>
                            <button className={viewType === 'dayGridMonth' ? styles.activeGrid : styles.grid} onClick={()=>handleChangeView('dayGridMonth')}>Month</button>
                            <button className={viewType === 'dayGridYear' ? styles.activeGrid : styles.grid} onClick={()=>handleChangeView('dayGridYear')}>Year</button>
                        </div>

                        <div className={styles.search}>
                            <img src={getImageUrl('searchIcon.png')} alt="" />
                            <input onChange={handleSearch} type="text" placeholder="Search" />
                        </div>
                    </div>
                    
                    <FullCalendar
                        plugins={[dayGridPlugin,timeGridPlugin,interactionPlugin]}
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
            }
        </div>
        </>
    )
}