require("dotenv").config();
const express = require('express');
// const mysql = require('mysql');
// const cors = require('cors');

const { Sequelize, DataTypes } = require("sequelize");

const app = express();
const port = process.env.PORT || 8081;
app.use(express.json());

const sequelize = new Sequelize(
    process.env.DB_URL, {
    dialect: 'sqlite',
    // storage: "./database.sqlite",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    }
});

sequelize.sync().then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err);
});

const post = sequelize.define("post", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

// const app = express();

// app.use(cors());
// app.use(express.json());

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Ebube012',
//     database: 'academy'
// })


app.get("/", (req, res) => {
    return res.json("BACKEND CONNECTED");
})

// app.get("/students", async (req, res) => {
//     try {
//         const allStudents = await post.
//     }
//     const u = "SELECT * FROM student"
//     db.query(u, (err, data) => {
//         if (err) return res.json(err)
//             res.send(data)
//     })
// })

// app.get("/courses", (req, res) => {
//     const c = "SELECT * FROM course"
//     db.query(c, (err, data) => {
//         if (err) {
//             return res.json(err);
//         } else {
//             res.send(data);
//         }
//     })
// })

// app.get("/enrollment", (req, res) => {
//     const c = "SELECT * FROM enrollment"
//     db.query(c, (err, data) => {
//         if (err) {
//             return res.json(err);
//         } else {
//             res.send(data);
//         }
//     })
// })

// app.get("/courses/:student_id", (req, res) => {
//     const id = req.params.student_id;
//     const c = "SELECT * FROM course INNER JOIN enrollment ON course.course_id = enrollment.course_id WHERE enrollment.student_id = ?"
//     db.query(c, id, (err, data) => {
//         if (err) return res.json(err);
//         else {
//             res.send(data);
//         }
//     })
// })

// app.get("/teachers", (req, res) => {
//     const c = "SELECT * FROM instructor"
//     db.query(c, (err, data) => {
//         if (err) {
//             return res.json(err);
//         } else {
//             res.send(data);
//         }
//     })
// })

// app.get("/activity-log", (req, res) => {
//     const c = "SELECT * FROM activity_log"
//     db.query(c, (err, data) => {
//         if (err) {
//             return res.json(err);
//         } else {
//             res.send(data);
//         }
//     })
// })


app.post('/new-teacher', async (req, res) => {
    const sql = "INSERT INTO instructor (first_name, date_added, email, phone_number) VALUES (?)";
    const values = [
        req.body.name,
        req.body.date,
        req.body.email,
        req.body.phone_number
    ]
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
            return res.json({Message: "Error in adding instructor"})
        }
        console.log(req.body);
        console.log(result);
        return res.json(result);
    });

    const sql2 = "INSERT INTO activity_log (activity, date) VALUES (?)";
    const activity = req.body.course === "" ? "New instructor, " + req.body.name + ", added."
                                            : "New instructor, " + req.body.name + ", added to " + req.body.course + ".";
    const logValues = [
        activity,
        req.body.date
    ]
    db.query(sql2, [logValues], (err, result) => {
        if (err) {
            console.log(err);
            return res.json({Message: "Error in adding to log"})
        }
        console.log(req.body);
        console.log(result);
        // return res.json(result);
    });
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