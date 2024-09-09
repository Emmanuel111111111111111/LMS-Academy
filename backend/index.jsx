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


app.get("/users", (req, res) => {
    const u = "SELECT * FROM users"
    db.query(u, (err, data) => {
        if (err) return res.json(err)
            return res.json(data)
    })
})

app.get("/courses/{studentId}", (req, res) => {
    const c = "SELECT * FROM courses"
    db.query(c, (err, data) => {
        if (err) return res.json(err)
            return res.json(data)
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