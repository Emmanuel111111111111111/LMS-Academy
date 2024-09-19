const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ebube012',
    database: 'academy'
})


app.get("/", (req, res) => {
    return res.json("BACKEND CONNECTED");
})

app.get("/students", (req, res) => {
    const u = "SELECT * FROM student"
    db.query(u, (err, data) => {
        if (err) return res.json(err)
            res.send(data)
    })
})

app.get("/courses", (req, res) => {
    const c = "SELECT * FROM course"
    db.query(c, (err, data) => {
        if (err) {
            return res.json(err);
        } else {
            res.send(data);
        }
    })
})

app.get("/courses/:student_id", (req, res) => {
    const id = req.params.student_id;
    // console.log(id);
    const c = "SELECT * FROM course INNER JOIN enrollment ON course.course_id = enrollment.course_id WHERE enrollment.student_id = ?"
    db.query(c, id, (err, data) => {
        if (err) return res.json(err);
        else {
            res.send(data);
        }
    })
})

app.get("/teachers", (req, res) => {
    const c = "SELECT * FROM instructor"
    db.query(c, (err, data) => {
        if (err) {
            return res.json(err);
        } else {
            res.send(data);
        }
    })
})


app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM student WHERE email = ? AND password = ? ';
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Login failed");
        if(data.length > 0) {
            return res.json(data);
        } else {
            return res.json("No records");
        }
    })
})

app.post('/adminlogin', (req, res) => {
    const sql = 'SELECT * FROM instuctors WHERE (email = ? OR phone_number = ?) AND password = ? ';
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) return res.json("Login failed");
        if(data.length > 0) {
            return res.json("Login Successfully")
        } else {
            return res.json("No records")
        }
    })
})

app.post("/signup", (req, res) => {
    const sql = "INSERT INTO users (first_name, last_name, email, phone_number, learning_mode, password) VALUES (?)";
    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.email,
        req.body.phone_number,
        req.body.learning_mode,
        req.body.password
    ]
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
            return res.json({Message: "Error in Node"})
        }
        console.log(req.body);
        console.log(result);
        return res.json(result);
    });
})

app.listen(8081, () => {
    console.log("Connect to backend.")
})