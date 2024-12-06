const bcrypt = require('bcrypt');
require("dotenv").config();
const express = require('express');
const { Client } = require('pg');
const cors = require('cors');

const app = express();
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

app.get("/courses", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM course");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching courses"});
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
    try {
        const query = `
            SELECT c.*, 
                i.instructor_id AS instructor_id,
                i.first_name AS instructor_first_name,
                i.last_name AS instructor_last_name,
                COUNT(s.student_id) AS student_count,
                l.lesson_id AS lesson_id,
                l.title AS lesson_title,
                l.file_data AS lesson_data
            FROM course c
            LEFT JOIN instructorCourses ic ON c.course_id = ic.course_id
            LEFT JOIN instructor i ON ic.instructor_id = i.instructor_id
            LEFT JOIN enrollment e ON c.course_id = e.course_id
            LEFT JOIN student s ON e.student_id = s.student_id
            LEFT JOIN lesson l ON c.course_id = l.course_id
            GROUP BY c.course_id, i.instructor_id, l.lesson_id
            ORDER BY c.course_id, i.instructor_id;
        `;

        const result = await client.query(query);
        const courses = result.rows;

        const formattedCourses = {};
        courses.forEach(row => {
            if (!formattedCourses[row.course_id]) {
                formattedCourses[row.course_id] = {
                    ...row,
                    instructors: [],
                    lessons: [],
                    student_count: parseInt(row.student_count) || 0
                };
                delete formattedCourses[row.course_id].instructor_id;
                delete formattedCourses[row.course_id].instructor_first_name;
                delete formattedCourses[row.course_id].instructor_last_name;
                delete formattedCourses[row.course_id].lesson_data;
                delete formattedCourses[row.course_id].lesson_id;
                delete formattedCourses[row.course_id].lesson_title;
            }
            if (row.instructor_id) {
                formattedCourses[row.course_id].instructors.push({
                    id: row.instructor_id,
                    name: row.instructor_first_name + ' ' + (row.instructor_last_name || '')
                });
            }
            if (row.lesson_id) {
                formattedCourses[row.course_id].lessons.push({
                    id: row.lesson_id,
                    title: row.lesson_title,
                    file_data: row.lesson_data,
                });
            }
        });

        res.json(Object.values(formattedCourses));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/courses-instructor-students', async (req, res) => {
    try {
        const query = `
            SELECT c.*, 
                   i.instructor_id AS instructor_id,
                   i.first_name AS instructor_first_name,
                   i.last_name AS instructor_last_name,
                   i.profile_img AS instructor_pfp,
                   s.student_id AS student_id,
                   s.first_name AS student_first_name,
                   s.last_name AS student_last_name,
                   s.profile_img AS student_pfp
            FROM course c
            LEFT JOIN instructorCourses ic ON c.course_id = ic.course_id
            LEFT JOIN instructor i ON ic.instructor_id = i.instructor_id
            LEFT JOIN enrollment e ON c.course_id = e.course_id
            LEFT JOIN student s ON e.student_id = s.student_id
            ORDER BY c.course_id, i.instructor_id, s.student_id;
        `;

        const result = await client.query(query);
        const courses = result.rows;

        const formattedCourses = {};
        courses.forEach(row => {
            if (!formattedCourses[row.course_id]) {
                formattedCourses[row.course_id] = {
                    ...row,
                    instructors: [],
                    students: []
                };
                delete formattedCourses[row.course_id].instructor_id;
                delete formattedCourses[row.course_id].instructor_first_name;
                delete formattedCourses[row.course_id].instructor_last_name;
                delete formattedCourses[row.course_id].instructor_pfp;
                delete formattedCourses[row.course_id].student_id;
                delete formattedCourses[row.course_id].student_first_name;
                delete formattedCourses[row.course_id].student_last_name;
                delete formattedCourses[row.course_id].student_pfp;
            }

            if (row.instructor_id) {
                formattedCourses[row.course_id].instructors.push({
                    id: row.instructor_id,
                    first_name: row.instructor_first_name,
                    last_name: row.instructor_last_name,
                    name: row.instructor_first_name + ' ' + (row.instructor_last_name || ''),
                    pfp: row.instructor_pfp
                });
            }
            if (row.student_id) {
                formattedCourses[row.course_id].students.push({
                    id: row.student_id,
                    first_name: row.student_first_name,
                    last_name: row.student_last_name,
                    name: row.student_first_name + ' ' + (row.student_last_name || ''),
                    pfp: row.student_pfp
                });
            }
        });

        res.json(Object.values(formattedCourses));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/courses/:student_id", async (req, res) => {
    const id = req.params.student_id;
    const query = "SELECT * FROM course INNER JOIN enrollment ON course.course_id = enrollment.course_id WHERE enrollment.student_id = ($1)"
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
    const query = "SELECT * FROM course WHERE course_id = ($1)"
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
    const { name, description } = req.body;

    try {
        const query = "UPDATE course SET name = $1, description = $2 WHERE course_id = $3";
        await client.query(query, [name, description, id]);

        res.status(200).json({ message: 'Course updated successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message:'Error updating course' });
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
app.get("/teachers-len", async (req, res) => {
    try {
        const result = await client.query("SELECT COUNT(*) FROM instructor");
        res.send(result.rows[0].count);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching teachers length"});
    }
});

app.get("/activity-log", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM activity_log");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching activity log"});
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
    
    const { newLessonTitle, course_id } = req.body;

    if (!newLessonTitle || !course_id) {
        console.log('No id or title')
        return res.status(400).json({ message: 'Title and course ID are required' });
    }

    try {
        const insertQuery = `INSERT INTO lesson (title, course_id) VALUES ($1, $2) RETURNING *;`;
        const values = [newLessonTitle, course_id];
        const result = await client.query(insertQuery, values);

        res.status(201).json(result.rows[0]);
        
    } catch (err) {
        console.error('Error saving lesson:', err);
        res.status(500).json({ message: 'Error saving lesson' });
    }
});

app.get('/lessons/:studentID', async (req, res) => {
    try {
        const id = req.params.course_id;
        const query = `
            SELECT * FROM lesson l
            LEFT JOIN lesson_student ls ON ls.student_id = ($1)
        `;
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error grabbing lesson_student info' });
    }
});


app.post('/new-teacher', async (req, res) => {
    const query = "INSERT INTO instructor (first_name, date_added, email, phone_number) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [
        req.body.name,
        req.body.date,
        req.body.email,
        req.body.phone_number
    ];
    try {
        const result = await client.query(query, values);
        console.log(result.rows[0]);

        const activity = req.body.course_name === ""
            ? 'New instructor, ' + req.body.name + ' added.'
            : 'New instructor, ' + req.body.name + ' added to ' + req.body.course_name + '.';

        const logQuery = "INSERT INTO activity_log (activity, date) VALUES ($1, $2) RETURNING *";
        const logValues = [
            activity,
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
        // console.log(result);
        const activity = "New course, " + req.body.name + ", added.";
        const logQuery = "INSERT INTO activity_log (activity, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.date
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Instructor added successfully", instructor: result.rows[0]});

    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in adding new course or logging"});
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
    const values = [req.body.email];
    try {
        const result = await client.query(query, values);
        if (result.rows.length === 0) return res.status(404).json({ message: "No records" });

        const instructor = result.rows[0];
        // const isPasswordValid = await bcrypt.compare(req.body.password, instructor.password);
        if (req.body.password != instructor.password) return res.status(401).json({message: "Invalid credentials"});

        const loginQuery = "UPDATE student SET last_logged = $1 WHERE student_id = $2";
        await client.query(loginQuery, [new Date(), student.student_id]);

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
        console.error("Error verifying password:", error);
        throw error;
    }
};


app.listen(port, () => {
    console.log("Connect to backend.")
})