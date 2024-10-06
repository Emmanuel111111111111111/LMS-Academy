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
})

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
    return res.json("BACKEND CONNECTED");
})

app.get("/students", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM student");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching students"});
    }
})

app.get("/courses", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM course");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching courses"});
    }
})

app.get("/enrollment", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM enrollment");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching enrollments"});
    }
})

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
})

app.get("/teachers", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM instructor");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching teachers"});
    }
})

app.get("/activity-log", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM activity_log");
        res.send(result.rows);
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Error fetching activity log"});
    }
    // const c = "SELECT * FROM activity_log"
    // db.query(c, (err, data) => {
    //     if (err) {
    //         return res.json(err);
    //     } else {
    //         res.send(data);
    //     }
    // })
})


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

        const activity = req.body.course === ""
            ? 'New instructor, ${req.body.name}, added.'
            : 'New instructor, ${req.body.name}, added to ${req.body.course}.';

        const logQuery = "INSERT INTO activity_log (activity, date) VALUES ($1, $2)";
        const logValues = [
            activity,
            req.body.date
        ];

        await client.query(logQuery, logValues);
        res.json({message: "Instructor added successfully", instructor: result.rows[0]});
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Error in adding new instructor or logging"});
    }
})


// app.post('/new-course', (req, res) => {
//     const sql = "INSERT INTO course (name, duration) VALUES (?)";
//     const values = [
//         req.body.name,
//         req.body.duration
//     ]
//     db.query(sql, [values], (err, result) => {
//         if (err) {
//             console.log(err);
//             return res.json({Message: "Error in adding course"})
//         }
//         console.log(req.body);
//         console.log(result);
//         return res.json(result);
//     });

//     const sql2 = "INSERT INTO activity_log (activity, date) VALUES (?)";
//     const activity = "New course, " + req.body.name + ", added.";
//     const logValues = [
//         activity,
//         req.body.date
//     ]
//     db.query(sql2, [logValues], (err, result) => {
//         if (err) {
//             console.log(err);
//             return res.json({Message: "Error in adding to log"})
//         }
//         console.log(req.body);
//         console.log(result);
//         // return res.json(result);
//     });
// })


// app.post('/login', (req, res) => {
//     const sql = 'SELECT * FROM student WHERE email = ? AND password = ? ';
//     db.query(sql, [req.body.email, req.body.password], (err, data) => {
//         if (err) return res.json("Login failed");
//         if(data.length > 0) {
//             return res.json(data);
//         } else {
//             return res.json("No records");
//         }
//     })
// })

// app.post('/adminlogin', (req, res) => {
//     const sql = 'SELECT * FROM instuctors WHERE (email = ? OR phone_number = ?) AND password = ? ';
//     db.query(sql, [req.body.email, req.body.password], (err, data) => {
//         if (err) return res.json("Login failed");
//         if(data.length > 0) {
//             return res.json("Login Successfully")
//         } else {
//             return res.json("No records")
//         }
//     })
// })

// app.post("/signup", (req, res) => {
//     const sql = "INSERT INTO users (first_name, last_name, email, phone_number, learning_mode, password) VALUES (?)";
//     const values = [
//         req.body.first_name,
//         req.body.last_name,
//         req.body.email,
//         req.body.phone_number,
//         req.body.learning_mode,
//         req.body.password
//     ]
//     db.query(sql, [values], (err, result) => {
//         if (err) {
//             console.log(err);
//             return res.json({Message: "Error in Node"})
//         }
//         console.log(req.body);
//         console.log(result);
//         return res.json(result);
//     });
// })

app.listen(port, () => {
    console.log("Connect to backend.")
})