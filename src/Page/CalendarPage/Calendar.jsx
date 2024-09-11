import React, { useRef, useState } from "react";
import styles from './Calendar.module.css';
import { getImageUrl } from "../../utilis";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';


export const CalendarPage = () => {

    const [ search, setSearch] = useState("");
    const [ viewType, setViewType ] = useState('timeGridWeek');
    const navigate = useNavigate();
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
            type: 'Class'
        },
        {
            title: 'Course Title 4',
            start: new Date(2024, 8, 6, 14, 0),
            end: new Date(2024, 8, 6, 15, 0),
            type: 'Assignment'
        },
        {
            title: 'Course Title 5',
            start: new Date(2024, 8, 6, 7, 30),
            end: new Date(2024, 8, 6, 9, 0),
            type: 'Exam'
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



    return (
        <>
        <div className={styles.whole}>
            
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
                        info.el.style.textOverflow = 'ellipses';

                        if (eventType.toLowerCase() === 'class') {
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
        </>
    )
}