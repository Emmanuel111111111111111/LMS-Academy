// import bcrypt from 'bcrypt';
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

// const mysql = require('mysql');
// const { Sequelize, DataTypes } = require("sequelize");

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Ebube012',
//     database: 'academy'
// })


app.get("/", (req, res) => {
    // console.log('Working');
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

app.get("/courses/:student_id", async (req, res) => {
    const id = req.params.student_id;
    const query = "SELECT * FROM course INNER JOIN enrollment ON course.course_id = enrollment.course_id WHERE enrollment.student_id = ?"
    try {
        const result = await client.query(query, [id]);
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching courses/id"});
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
app.get("/students-len", async (req, res) => {
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
    const duration = req.body.duration_number + ' ' + req.body.duration_unit;
    const query = "INSERT INTO course (name, duration, type, date_added) VALUES ($1, $2, $3, $4)";
    const values = [
        req.body.name,
        duration,
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
    const values = [req.body.email];
    try {
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No records" });
        }

        const student = result.rows[0];
        // const isPasswordValid = await bcrypt.compare(req.body.password, student.password);

        if (req.body.password != student.password) {
            return res.status(401).json({message: "Invalid credentials"});
        }
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
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No records" });
        }

        const instructor = result.rows[0];
        // const isPasswordValid = await bcrypt.compare(req.body.password, instructor.password);

        if (req.body.password != instructor.password) {
            return res.status(401).json({message: "Invalid credentials"});
        }
        return res.json(instructor);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Login failed"});
    }
});

app.post("/signup", async (req, res) => {
    const query = "INSERT INTO student (first_name, last_name, email, phone_number, learning_mode, password) VALUES ($1, $2, $3, $4, $5, $6)";
    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.phone_number,
        req.body.learning_mode,
        req.body.password,
        // await bcrypt.hash(req.body.password, 10)
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



app.listen(port, () => {
    console.log("Connect to backend.")
})