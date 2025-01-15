const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { id } = require('date-fns/locale');
require("dotenv").config();

const app = express();
const upload = multer();
const port = process.env.PORT || 8081;
app.use(express.json());
app.use(cors());

const client = new Client({
    connectionString: process.env.DB_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

client.connect();


app.get("/", (req, res) => {
    return res.json("BACKEND IS CONNECTED");
});



app.get("/students", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM student");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching students"});
    }
});
app.get("/students-len", async (req, res) => {
    try {
        const result = await client.query("SELECT COUNT(*) FROM student");
        res.send(result.rows[0].count);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching students length"});
    }
});
app.get("/getStudentWithEmail/:email", async (req, res) => {
    const email = req.params.email;
    const query = "SELECT * FROM student WHERE email = ($1)"
    try {
        const result = await client.query(query, [email]);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching student/email"});
    }
});



app.get("/teachers", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM instructor");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching teachers"});
    }
});
app.get("/teachers/:id", async (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM instructor WHERE instructor_id = ($1)"
    try {
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching instructor with id"});
    }
});
app.get("/teachers-len", async (req, res) => {
    try {
        const result = await client.query("SELECT COUNT(*) FROM instructor");
        res.send(result.rows[0].count);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching teachers length"});
    }
});
app.post('/new-teacher', async (req, res) => {
    const query = "INSERT INTO instructor (first_name, last_name, date_added, email, phone_number) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.date,
        req.body.email,
        req.body.phone_number
    ];
    try {
        const result = await client.query(query, values);
        console.log(result.rows[0]);
        const instructor_id = result.rows[0].instructor_id;

        const assignQuery = "INSERT INTO instructorcourses (instructor_id, course_id) VALUES ($1, $2)";
        const assignValues = [
            instructor_id,
            req.body.course_id
        ];

        const assignResult = await client.query(assignQuery, assignValues);
        console.log(assignResult.rows[0])



        const activity = req.body.course_name === ""
            ? 'New instructor, ' + req.body.name + ' added.'
            : 'New instructor, ' + req.body.name + ' added to ' + req.body.course_name + '.';

        const logQuery = "INSERT INTO activity_log (activity, user, date) VALUES ($1, $2) RETURNING *";
        const logValues = [
            activity,
            req.body.user,
            req.body.date
        ];

        const logResult = await client.query(logQuery, logValues);
        console.log(logResult.rows[0])
        res.json({message: "Instructor added successfully", instructor: result.rows[0]});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in adding new instructor or logging"});
    }
});
app.put('/suspend-teacher', async (req, res) => {
    const query = "UPDATE instructor SET suspended = true WHERE instructor_id = $1";
    const values = [
        req.body.instructor_id
    ]
    try {
        const result = await client.query(query, values);
        const activity = "Instructor, " + req.body.instructor_name + ", was suspended.";
        const logQuery = "INSERT INTO activity_log (activity, user, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.user,
            req.body.date
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Instructor suspended successfully", instructor: result.rows[0]});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in suspending instructor or logging"});
    }
});
app.put('/delete-teacher', async (req, res) => {
    const query = "UPDATE instructor SET deleted = true WHERE instructor_id = $1";
    const values = [
        req.body.instructor_id
    ]
    try {
        const result = await client.query(query, values);
        const activity = "Instructor, " + req.body.instructor_name + ", was deleted.";
        const logQuery = "INSERT INTO activity_log (activity, user, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.user,
            req.body.date
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Instructor deleted successfully", instructor: result.rows[0]});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in deleting instructor or logging"});
    }
});



app.get("/courses", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM course WHERE deleted = FALSE ORDER BY date_added DESC");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching courses"});
    }
});
app.post('/new-course', async (req, res) => {
    const query = "INSERT INTO course (name, duration, type, date_added) VALUES ($1, $2, $3, $4)";
    const values = [
        req.body.name,
        req.body.duration,
        req.body.type,
        req.body.date
    ]
    try {
        const result = await client.query(query, values);
        const activity = "New course, " + req.body.name + ", added.";
        const logQuery = "INSERT INTO activity_log (activity, user, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.user,
            req.body.date
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Instructor added successfully", instructor: result.rows[0]});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in adding new course or logging"});
    }
});
app.put('/delete-course', async (req, res) => {
    const query = "UPDATE course SET deleted = true WHERE course_id = $1";
    const values = [
        req.body.course_id
    ]
    try {
        const result = await client.query(query, values);
        const activity = "Course, " + req.body.course_name + ", deleted.";
        const logQuery = "INSERT INTO activity_log (activity, user, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.user,
            req.body.date
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Course deleted successfully", instructor: result.rows[0]});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in deleting course or logging"});
    }
});

app.get("/courses/:student_id", async (req, res) => {
    const id = req.params.student_id;
    const query = "SELECT * FROM course INNER JOIN enrollment ON course.course_id = enrollment.course_id WHERE enrollment.student_id = ($1) AND course.deleted = FALSE"
    try {
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching courses/studentId"});
    }
});
app.get("/courses/detail/:course_id", async (req, res) => {
    const id = req.params.course_id;
    const query = "SELECT * FROM course WHERE course_id = ($1) AND course.deleted = FALSE"
    try {
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching courses/details/id"});
    }
});
app.put('/courses/detail/:course_id', async (req, res) => {
    const id = req.params.course_id;
    const { name, description, level, status } = req.body;

    try {
        const query = "UPDATE course SET name = $1, description = $2, level = $3, status = $4 WHERE course_id = $5";
        await client.query(query, [name, description, level, status, id]);

        res.status(200).json({ message: 'Course updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message:'Error updating course' });
    }
});




app.get("/instructorcourses", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM instructorcourses");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching instructor-courses"});
    }
});
app.get('/courses-instructor-studentscount-lessons', async (req, res) => {
    const query = `
        SELECT 
            c.course_id,
            c.name AS course_name,
            c.description,
            c.date_added,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'instructor_id', i.instructor_id,
                        'first_name', i.first_name,
                        'last_name', i.last_name
                    )
                ) FILTER (WHERE i.instructor_id IS NOT NULL), 
                '[]'::JSON
            ) AS instructors,
            COUNT(DISTINCT s.student_id) AS student_count,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'lesson_id', l.lesson_id,
                        'lesson_title', l.title
                    )
                ) FILTER (WHERE l.lesson_id IS NOT NULL), 
                '[]'::JSON
            ) AS lessons
        FROM 
            course c
        LEFT JOIN 
            instructorCourses ic ON c.course_id = ic.course_id
        LEFT JOIN 
            instructor i ON ic.instructor_id = i.instructor_id
        LEFT JOIN 
            enrollment e ON c.course_id = e.course_id
        LEFT JOIN 
            student s ON e.student_id = s.student_id
        LEFT JOIN 
            lesson l ON c.course_id = l.course_id
        WHERE 
            c.deleted = FALSE
        GROUP BY 
            c.course_id
        ORDER BY 
            c.date_added;
    `;

    try {
        const result = await client.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/courses-instructor-students', async (req, res) => {
    const query = `
        SELECT 
            c.course_id,
            c.name AS course_name,
            c.description,
            c.date_added,
            COALESCE(
                JSON_AGG(
                    DISTINCT JSON_BUILD_OBJECT(
                        'id', i.instructor_id,
                        'first_name', i.first_name,
                        'last_name', i.last_name,
                        'name', i.first_name || ' ' || COALESCE(i.last_name, ''),
                        'pfp', i.profile_img
                    )
                ) FILTER (WHERE i.instructor_id IS NOT NULL), 
                '[]'::JSON
            ) AS instructors,
            COALESCE(
                JSON_AGG(
                    DISTINCT JSON_BUILD_OBJECT(
                        'id', s.student_id,
                        'first_name', s.first_name,
                        'last_name', s.last_name,
                        'name', s.first_name || ' ' || COALESCE(s.last_name, ''),
                        'pfp', s.profile_img
                    )
                ) FILTER (WHERE s.student_id IS NOT NULL), 
                '[]'::JSON
            ) AS students
        FROM 
            course c
        LEFT JOIN 
            instructorCourses ic ON c.course_id = ic.course_id
        LEFT JOIN 
            instructor i ON ic.instructor_id = i.instructor_id
        LEFT JOIN 
            enrollment e ON c.course_id = e.course_id
        LEFT JOIN 
            student s ON e.student_id = s.student_id
        WHERE 
            c.deleted = FALSE
        GROUP BY 
            c.course_id
        ORDER BY 
            c.course_id;
    `;

    try {
        const result = await client.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get("/lessons", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM lesson");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching lessons"});
    }
});
app.get("/lessons-course/:courseId", async (req, res) => {

    const id = req.params.courseId;

    try {
        const result = await client.query("SELECT * FROM lesson WHERE course_id = $1", [id]);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching lessons"});
    }
});
app.get("/lessons-info", async (req, res) => {
    const query = `
        SELECT 
            lesson.lesson_id,
            lesson.title,
            lesson.description,
            lesson.start_date,
            lesson.end_date,
            lesson.number,
            lesson.course_id,
            COALESCE(course.name, 'NA') AS course_name,
            COALESCE(instructor.first_name || '' || ' ' || instructor.last_name, 'NA') AS instructor_name,
            COALESCE(student_counts.student_count, 0) AS student_count
        FROM 
            lesson
        LEFT JOIN 
            course ON lesson.course_id = course.course_id
		LEFT JOIN 
            instructorcourses ON course.course_id = instructorcourses.course_id
        LEFT JOIN 
            instructor ON instructorcourses.instructor_id = instructor.instructor_id
		LEFT JOIN (
            SELECT 
                course_id,
                COUNT(student_id) AS student_count
            FROM 
                enrollment
            GROUP BY 
                course_id
        ) student_counts ON course.course_id = student_counts.course_id
        WHERE course.deleted = FALSE
        GROUP BY 
            lesson.lesson_id,
			lesson.title,
			lesson.description,
			lesson.number,
			course.name,
			instructor.first_name,
			instructor.last_name,
			student_counts.student_count
        ORDER BY 
            lesson.lesson_id;
        `

    try {
        const result = await client.query(query);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Error grabbing cohorts` });
    }
});
app.post(`/lesson-info`, upload.array('files'), async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);
        console.log(req.body.files);
        const files = req.body.files;

        const putQuery = `UPDATE lesson SET title = $1, description = $2, level = $3, status = $4 WHERE lesson_id = $5`
        const putValues = [
            req.body.title,
            req.body.description,
            req.body.level,
            req.body.status,
            req.body.lesson_id
        ];

        await client.query(putQuery, putValues);

        if (files && files.length === 1) {
            const postQuery = `INSERT INTO lesson_files (lesson_id, file_name, file_type, file_size, file_data) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
            const postValues = [
                req.body.lesson_id,
                files.originalname,
                files.mimetype,
                files.size,
                files.buffer
            ];
            console.log(files);
            console.log(files.originalname);
            console.log(postValues);
            // await client.query(postQuery, postValues);
        }

        if (files && files.length > 1) {
            for (const file of files) {

                const postQuery = `INSERT INTO lesson_files (lesson_id, file_name, file_type, file_size, file_data) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
                const postValues = [
                    req.body.lesson_id,
                    file.originalname,
                    file.mimetype,
                    file.size,
                    file.buffer
                ];
                console.log(file);
                console.log(file.originalname);
                console.log(postValues);
                // await client.query(postQuery, postValues);
            }
        }

        res.status(200).json({ message: 'Lesson updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message:'Error updating lesson or adding files' });
    }
})
app.get("/lessons-len", async (req, res) => {
    try {
        const result = await client.query("SELECT COUNT(*) FROM lesson");
        res.send(result.rows[0].count);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching lessons length"});
    }
});
app.post('/new-lesson', async (req, res) => {

    console.log(req.body);
    
    const { name, course_id, start_date, end_date } = req.body;

    if (!name || !course_id) {
        console.log('No id or title')
        return res.status(400).json({ message: 'Title and course ID are required' });
    }

    try {
        const insertQuery = `INSERT INTO lesson (title, course_id, start_date, end_date) VALUES ($1, $2, $3, $4) RETURNING *;`;
        const values = [name, course_id, start_date, end_date];
        const result = await client.query(insertQuery, values);

        res.status(201).json(result.rows[0]);
        
    } catch (err) {
        console.error('Error saving lesson:', err);
        res.status(500).json({ message: 'Error saving lesson' });
    }
});

app.get('/lessons/:studentID', async (req, res) => {
    try {
        const id = req.params.studentID;
        // const query = `
        //     SELECT * FROM lesson l
        //     LEFT JOIN lesson_student ls ON ls.student_id = ($1)
        // `;
        const query = "SELECT * FROM lesson_student WHERE student_id = ($1)";
        
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error grabbing lesson_student info' });
    }
});




app.get("/assignments", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM assignment");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching assignments"});
    }
});
app.get('/assignments/:studentID', async (req, res) => {
    try {
        const id = req.params.course_id;
        // const query = `
        //     SELECT * FROM lesson l
        //     LEFT JOIN lesson_student ls ON ls.student_id = ($1)
        // `;
        const query = "SELECT * FROM lesson_student WHERE student_id = ($1)";
        
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error grabbing lesson_student info' });
    }
});
app.post('/new-assignment', async (req, res) => {
    
    const { name, lesson_id, due_date } = req.body;

    if (!name || !lesson_id) {
        console.log('No id or title')
        return res.status(400).json({ message: 'Title and course ID are required' });
    }

    try {
        const insertQuery = `INSERT INTO assignment (lesson_id, assignment_name, due_date) VALUES ($1, $2, $3) RETURNING *;`;
        const values = [lesson_id, name, due_date];
        const result = await client.query(insertQuery, values);

        res.status(201).json(result.rows[0]);
        
    } catch (err) {
        console.error('Error saving assignment:', err);
        res.status(500).json({ message: 'Error saving assignment' });
    }
});


app.get("/exams", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM exam");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching exams"});
    }
});
app.get('/exams/:studentID', async (req, res) => {
    try {
        const id = req.params.course_id;
        // const query = `
        //     SELECT * FROM lesson l
        //     LEFT JOIN lesson_student ls ON ls.student_id = ($1)
        // `;
        const query = "SELECT * FROM lesson_student WHERE student_id = ($1)";
        
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error grabbing lesson_student info' });
    }
});
app.post('/new-exam', async (req, res) => {
    
    console.log(req.body);
    const { name, course_id, due_date } = req.body;

    if (!name || !course_id) {
        console.log('No id or title')
        return res.status(400).json({ message: 'Title and course ID are required' });
    }

    try {
        const insertQuery = `INSERT INTO exam (course_id, exam_name, due_date) VALUES ($1, $2, $3) RETURNING *;`;
        const values = [course_id, name, due_date];
        const result = await client.query(insertQuery, values);

        res.status(201).json(result.rows[0]);
        
    } catch (err) {
        console.error('Error saving assignment:', err);
        res.status(500).json({ message: 'Error saving assignment' });
    }
});


app.get("/tasks", async (req, res) => {
    try {
        const result = await client.query(`
            SELECT 
                'assignment' AS type,
                a.assignment_id AS id,
                a.assignment_name AS name,
                c.name AS course_name,
                a.due_date AS due_date,
                asgn_student.student_id AS student_id,
                CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                asgn_student.graded AS graded,
                asgn_student.submitted AS submitted,
                asgn_student.submitted_date AS submitted_date
            FROM 
                assignment_student asgn_student
            JOIN 
                assignment a ON asgn_student.assignment_id = a.assignment_id
            JOIN 
                lesson l ON a.lesson_id = l.lesson_id
            JOIN 
                course c ON l.course_id = c.course_id
            JOIN 
                student s ON asgn_student.student_id = s.student_id
			WHERE c.deleted = FALSE

            UNION ALL

            SELECT 
                'exam' AS type,
                e.exam_id AS id,
                e.exam_name AS name,
                c.name AS course_name,
                e.due_date AS due_date,
                exam_student.student_id AS student_id,
                CONCAT(s.first_name, ' ', s.last_name) AS student_name,
                exam_student.graded AS graded,
                exam_student.submitted AS submitted,
                exam_student.submitted_date AS submitted_date
            FROM 
                exam_student
            JOIN 
                exam e ON exam_student.exam_id = e.exam_id
            JOIN 
                course c ON e.course_id = c.course_id
            JOIN 
                student s ON exam_student.student_id = s.student_id
			WHERE c.deleted = FALSE;
            `);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching assignments"});
    }
});

app.get("/events", async (req, res) => {
    try {
        const result = await client.query(`
            SELECT 
                'lesson' AS event_type,
                l.lesson_id AS event_id,
                l.title AS title,
                c.course_id,
                c.name AS course_name,
                l.start_date AS start,
                l.end_date AS end
            FROM 
                lesson l
            JOIN 
                course c ON l.course_id = c.course_id
            WHERE c.deleted = FALSE

            UNION ALL

            SELECT 
                'assignment' AS event_type,
                a.assignment_id AS event_id,
                a.assignment_name AS title,
                c.course_id,
                c.name AS course_name,
                a.due_date AS start,
                NULL AS end
            FROM 
                assignment a
            JOIN 
                lesson l ON a.lesson_id = l.lesson_id
            JOIN 
                course c ON l.course_id = c.course_id

            WHERE c.deleted = FALSE

            UNION ALL

            SELECT 
                'exam' AS event_type,
                e.exam_id AS event_id,
                e.exam_name AS title,
                c.course_id,
                c.name AS course_name,
                e.due_date AS start,
                NULL AS end
            FROM 
                exam e
            JOIN 
                course c ON e.course_id = c.course_id;
            
            WHERE c.deleted = FALSE
            
            `);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching assignments"});
    }
});
app.get("/events/:studentId", async (req, res) => {
    try {
        const result = await client.query(`
            SELECT 
                'lesson' AS event_type,
                l.lesson_id AS event_id,
                l.title AS title,
                c.course_id,
                c.name AS course_name,
                l.start_date AS start,
                l.end_date AS end
            FROM 
                lesson l
            JOIN 
                course c ON l.course_id = c.course_id
            JOIN 
                enrollment e ON e.course_id = c.course_id
            WHERE 
                e.student_id = $1

            UNION ALL

            SELECT 
                'assignment' AS event_type,
                a.assignment_id AS event_id,
                a.assignment_name AS title,
                c.course_id,
                c.name AS course_name,
                a.due_date AS start,
                NULL AS end
            FROM 
                assignment a
            JOIN 
                lesson l ON a.lesson_id = l.lesson_id
            JOIN 
                course c ON l.course_id = c.course_id
            JOIN 
                assignment_student asgn_student ON a.assignment_id = asgn_student.assignment_id
            WHERE 
                asgn_student.student_id = $1

            UNION ALL

            SELECT 
                'exam' AS event_type,
                e.exam_id AS event_id,
                e.exam_name AS title,
                c.course_id,
                c.name AS course_name,
                e.due_date AS start,
                NULL AS end
            FROM 
                exam e
            JOIN 
                course c ON e.course_id = c.course_id
            JOIN 
                exam_student exm_student ON e.exam_id = exm_student.exam_id
            WHERE 
                exm_student.student_id = $1;
            `,
            [req.params.studentId]);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching assignments"});
    }
});



app.get("/cohorts", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM cohort ORDER BY date_added DESC");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching cohorts"});
    }
});
app.get("/cohorts/:cohort_id", async (req, res) => {
    const id = req.params.cohort_id;
    const query = "SELECT * FROM cohort WHERE cohort_id = ($1)"; 
    try {
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching cohort"});
    }
});
app.post('/new-cohort', async (req, res) => {
    const query = "INSERT INTO cohort (cohort_name, cohort_number, description, start_date, end_date, cohort_year, date_added) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    const values = [
        req.body.name,
        req.body.cohort_number,
        req.body.description,
        req.body.start_date,
        req.body.end_date,
        req.body.year,
        req.body.date_added
    ]
    try {
        const result = await client.query(query, values);
        
        const activity = "New cohort, " + req.body.name + ", added.";
        const logQuery = "INSERT INTO activity_log (activity, user, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.user,
            req.body.date_added
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Cohort added successfully", instructor: result.rows[0]});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in adding new cohort or logging"});
    }
});

app.get ("/cohorts-details", async (req, res) => {
    const query = `
        SELECT 
            cohort.cohort_id,
            cohort.cohort_name,
            cohort.description,
            cohort.start_date,
            cohort.end_date,
            cohort.cohort_number,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'course_id', course.course_id,
                        'course_name', course.name,
                        'description', course.description,
                        'duration', course.duration,
                        'course_img', course.course_img,
                        'student_count', COALESCE(student_counts.student_count, 0),
                        'lesson_count', COALESCE(lesson_counts.lesson_count, 0)
                    )
                ) FILTER (WHERE course.course_id IS NOT NULL AND course.deleted = FALSE), 
                '[]'::JSON
            ) AS course
        FROM 
            cohort
        LEFT JOIN 
            cohort_course ON cohort.cohort_id = cohort_course.cohort_id AND cohort_course.suspended = false
        LEFT JOIN 
            course ON cohort_course.course_id = course.course_id
        LEFT JOIN (
            SELECT 
                course_id,
                COUNT(student_id) AS student_count
            FROM 
                enrollment
            GROUP BY 
                course_id
        ) student_counts ON course.course_id = student_counts.course_id
        LEFT JOIN (
            SELECT 
                course_id,
                COUNT(lesson_id) AS lesson_count
            FROM 
                lesson
            GROUP BY 
                course_id
        ) lesson_counts ON course.course_id = lesson_counts.course_id
        GROUP BY 
            cohort.cohort_id
        ORDER BY 
            cohort.cohort_id;
        `

    try {
        const result = await client.query(query);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Error grabbing cohorts` });
    }
        
})
app.get ("/cohorts-details/:cohort_id", async (req, res) => {
    const id = req.params.cohort_id;
    const query = `
        SELECT 
            cohort.cohort_id,
            cohort.cohort_name,
            cohort.description,
            cohort.start_date,
            cohort.end_date,
            cohort.cohort_number,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'course_id', course.course_id,
                        'course_name', course.name,
                        'description', course.description,
                        'duration', course.duration,
                        'course_img', course.course_img,
                        'student_count', COALESCE(student_counts.student_count, 0),
                        'lesson_count', COALESCE(lesson_counts.lesson_count, 0)
                    )
                ) FILTER (WHERE course.course_id IS NOT NULL AND course.deleted = FALSE), 
                '[]'::JSON
            ) AS course
        FROM 
            cohort
        LEFT JOIN 
            cohort_course ON cohort.cohort_id = cohort_course.cohort_id AND cohort_course.suspended = false
        LEFT JOIN 
            course ON cohort_course.course_id = course.course_id
        LEFT JOIN (
            SELECT 
                course_id,
                COUNT(student_id) AS student_count
            FROM 
                enrollment
            GROUP BY 
                course_id
        ) student_counts ON course.course_id = student_counts.course_id
        LEFT JOIN (
            SELECT 
                course_id,
                COUNT(lesson_id) AS lesson_count
            FROM 
                lesson
            GROUP BY 
                course_id
        ) lesson_counts ON course.course_id = lesson_counts.course_id
        WHERE cohort.cohort_id = ($1)
        GROUP BY 
            cohort.cohort_id
        ORDER BY 
            cohort.cohort_id;
        `

    try {
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Error grabbing cohort's info` });
    }
        
})

app.post('/new-cohort-course', async (req, res) => {
    const query = "INSERT INTO cohort_course (cohort_id, course_id) VALUES ($1, $2)";
    const values = [
        req.body.cohort_id,
        req.body.course_id
    ]
    try {
        const result = await client.query(query, values);
        
        const activity = "New course, " + req.body.course_name + " added to Cohort: " + req.body.cohort_name + ".";
        const logQuery = "INSERT INTO activity_log (activity, user, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.user,
            req.body.date_added
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Course added to Cohort successfully", cohort: result.rows[0]});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in adding new course to cohort or logging"});
    }
})
app.post('/suspend-course', async (req, res) => {

    const values = [
        req.body.cohort_id,
        req.body.course_id
    ]
    const query = 'UPDATE cohort_course SET suspended = true WHERE cohort_id = $1 AND course_id = $2';

    try {
        const result = await client.query(query, values);

        const activity = "Course, " + req.body.course_name + ", was suspended from Cohort: " + req.body.cohort_name + ".";
        const logQuery = "INSERT INTO activity_log (activity, user, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.user,
            req.body.date
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Suspended course successfully", cohort: result.rows[0]});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in suspending course or logging"});
    }
})
app.post('/remove-course', async (req, res) => {

    const values = [
        req.body.cohort_id,
        req.body.course_id
    ]
    const query = 'DELETE FROM cohort_course WHERE cohort_id = $1 AND course_id = $2';

    try {
        const result = await client.query(query, values);

        const activity = "Course, " + req.body.course_name + ", was removed from Cohort: " + req.body.cohort_name + ".";
        const logQuery = "INSERT INTO activity_log (activity, user, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.user,
            req.body.date
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Suspended course successfully", cohort: result.rows[0]});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in suspending course or logging"});
    }
})




app.get("/activity-log", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM activity_log ORDER BY date DESC");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching activity log"});
    }
});


app.get("/enrollment", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM enrollment");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching enrollments"});
    }
});

app.post('/login', async (req, res) => {
    const query = 'SELECT * FROM student WHERE email = $1';
    try {
        const result = await client.query(query, [req.body.email]);
        if (result.rows.length === 0) return res.status(404).json({ message: "No records" });

        const student = result.rows[0];
        const isPasswordValid = await verifyPassword(req.body.password, student.password);
        // if (req.body.password != student.password) return res.status(401).json({message: "Invalid credentials"});
        if (!isPasswordValid) return res.status(401).json({message: "Invalid password"});

        const loginQuery = "UPDATE student SET last_logged = $1 WHERE student_id = $2";
        await client.query(loginQuery, [new Date(), student.student_id]);

        return res.json(student);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Login failed"});
    }
});

app.post('/adminlogin', async (req, res) => {
    const query = 'SELECT * FROM instructor WHERE email = $1';
    try {
        const result = await client.query(query, [req.body.email]);
        if (result.rows.length === 0) return res.status(404).json({ message: "No records" });

        const instructor = result.rows[0];
        const isPasswordValid = await verifyPassword(req.body.password, instructor.password);
        if (!isPasswordValid) return res.status(401).json({message: "Invalid password"});
        return res.json(instructor);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Login failed"});
    }
});

app.post("/signup", async (req, res) => {

    const hashedPassword = await hashPassword(req.body.password);

    const query = "INSERT INTO student (first_name, last_name, email, phone_number, learning_mode, password, last_logged, date_added) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.phone_number,
        req.body.learning_mode,
        hashedPassword,
        new Date(),
        new Date(),
    ]
    try {
        const result = await client.query(query, values);
        console.log(req.body);
        console.log(result);
        return res.status(201).json({ message: "User created successfully", result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in signing up"});
    }
})

app.post("/admin-signup", async (req, res) => {

    console.log(req.body);

    const hashedPassword = await hashPassword(req.body.password);

    const query = 'UPDATE instructor SET password = $1 WHERE instructor_id = $2';
    const values = [
        hashedPassword,
        req.body.id
    ]
    try {
        const result = await client.query(query, values);
        console.log(result);
        return res.status(201).json({ message: "Instructor password added successfully", result });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error setting teacher password"});
    }
})


const hashPassword = async (plainPassword) => {
    try {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        console.log(hashedPassword)
        return hashedPassword;
    } catch (error) {
        console.error("Error hashing password:", error);
        throw error;
    }
};
const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error verifying password: ", error);
        throw error;
    }
};


app.listen(port, () => {
    console.log("Connect to backend.")
})