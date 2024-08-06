import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import courses from './src/course.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

app.use("/public", express.static(path.join(__dirname, "/public")));
app.use(express.json());

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then (()=>{
    console.log("DB Connnect successfully");
    app.listen(PORT, () =>{
        console.log("Server is Running on Port "+ PORT);
    });
}).catch((error)=> console.log(error))

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'CSSWENG Home page.html'));
});

app.get("/Encoder", function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'CSSWENG Encoder.html'));
});

app.get("/Heat_Index", function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'CSSWENG Heat.html'));
});

app.get("/api/subjects", async (req, res) => {
    try {
        const subjects = await courses.aggregate([
            {
                $group: {
                    _id: "$subjectabb",  // Group by the course code
                    college: { $first: "$college" },
                    courseCode: { $first: "$subjectabb" },
                    courseTitle: { $first: "$subjectname" },
                    takers: { $sum: "$subjecttakers" }, // Sum the number of takers
                    sections: { $addToSet: "$subjectsection" }
                }
            },
            {
                $project: {
                    _id: 0,
                    college: 1,
                    takers: 1,
                    courseCode: 1,
                    courseTitle: 1,
                    sections: 1
                }
            }
        ]);
        res.json(subjects);
    } catch (error) {
        console.error("Failed to fetch subjects:", error);
        res.status(500).json({ message: "Failed to fetch subjects", error: error.message });
    }
});

app.post("/uploadCourse", async (req, res) => {
    try {
        const subject = new courses(req.body);
        await subject.save();
        res.status(201).send({ message: "Subject added successfully!" });
    } catch (error) {
        res.status(400).send({ message: "Error adding subject", error: error.message });
    }
});