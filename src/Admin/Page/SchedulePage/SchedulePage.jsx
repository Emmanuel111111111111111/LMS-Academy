import React, { useRef, useState } from "react";
import styles from './Calendar.module.css';
import { getImageUrl } from "../../../utilis";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';


export const SchedulePage = () => {

    const [ search, setSearch] = useState("");
    const [ viewType, setViewType ] = useState('timeGridWeek');
    const navigate = useNavigate();
    const scroll = useRef(null);
    const calendarRef = useRef(null);
    const calendarAPI = calendarRef?.current?.getApi();


    const courses = [
        {
            title: 'Course Title 1',
            start: new Date(2024, 8, 5, 10, 0),
            end: new Date(2024, 8, 5, 12, 0),
            type: 'Class'
        },
        {
            title: 'Course Title 2',
            start: new Date(2024, 8, 5, 19, 0),
            allDay: false,
            type: 'Assignment'
        },
        {
            title: 'Course Title 3',
            start: new Date(2024, 8, 4, 16, 30),
            allDay: false,
            type: 'Assignment'
        },
        {
            title: 'Course Title 4',
            start: new Date(2024, 8, 6, 14, 0),
            end: new Date(2024, 8, 6, 15, 0),
            type: 'Class'
        }
    ]

    const events = [
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'July 1, 2024'
        },
        {
            courseName: 'Oracle',
            eventType: 'CLASS',
            dueTime: '12:38:00 PM',
            dueDate: 'July 25, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 1, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 22, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'CLASS',
            dueTime: '12:38:00 PM',
            dueDate: 'August 29, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 1, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'July 1, 2024'
        },
        {
            courseName: 'Oracle',
            eventType: 'CLASS',
            dueTime: '12:38:00 PM',
            dueDate: 'July 25, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 1, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'ASSIGNMENT',
            dueTime: '12:38:00 PM',
            dueDate: 'August 22, 2024'
        },
        {
            courseName: 'IT Infrastructure',
            eventType: 'CLASS',
            dueTime: '12:38:00 PM',
            dueDate: 'August 29, 2024'
        }
    ]
    
    const handleChangeView = (view) => {
        calendarAPI?.changeView(view);
        setViewType(view);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const filteredEvents = courses.filter(event => {
        const searchLower = search.toLowerCase();
        return (
            event.title.toLowerCase().includes(searchLower)
        );
    });

    console.log(search);
    console.log(filteredEvents);


    return (
        <>
        <div className={styles.whole}>
            
            <div className={styles.bigDiv}>

                <div className={styles.calendarHeader}>
                    <div className={`${styles.buttons} ${styles.move}`}>
                        <button className={styles.prev} onClick={()=>calendarAPI?.prev()}><img src={getImageUrl('prev.png')} /></button>
                        <button className={styles.today} onClick={()=>calendarAPI?.today()}>Today</button>
                        <button className={styles.next} onClick={()=>calendarAPI?.next()}><img src={getImageUrl('next.png')} /></button>
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
                    initialDate={'2024-09-04'}
                    ref={calendarRef}
                    initialView={'timeGridWeek'}
                    allDaySlot={false}
                    headerToolbar={false}
                    events={filteredEvents}
                    startParam="start"
                    endParam="end"
                    eventBorderColor="transparent"
                    dayHeaderContent={(args) => {
                        const date = args.date;
                        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const dayOfMonth = date.getDate();
                
                        return (
                            <div className={styles.dayHeader}>
                                <h1>{dayOfWeek.toUpperCase()}</h1>
                                <h2>{dayOfMonth}</h2>
                            </div>
                        );
                    }}
                    eventDidMount={(info) => {
                        const eventType = info.event.extendedProps.type;

                        info.el.style.padding = '4px';
                        info.el.style.fontSize = '12px';
                        info.el.style.fontWeight = 500;

                        if (eventType === 'Class') {
                            info.el.style.backgroundColor = '#0EA5E91A';
                            info.el.style.borderLeft = '3px solid #0EA5E9';
                            info.el.style.color = '#0369A1';
                            // info.el.style.color = '#0369A1 !important';
                            info.el.classList.add('class-event');
                        }
                        else if (eventType === 'Assignment') {
                            info.el.style.backgroundColor = '#10B9811A';
                            info.el.style.borderLeft = '3px solid #10B981';
                            info.el.style.color = '#047857';
                            // info.el.style.color = '#047857 !important';
                            info.el.classList.add('assignment-event');
                        }
                    }}
                />
                
            </div>
        </div>
        </>
    )
}