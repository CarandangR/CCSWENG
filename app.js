import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import courses from './src/course.js';
import courseFlowchart from './src/flowchart.js'

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

app.get("/Flowchart", function (req, res) {
    res.sendFile(path.join(__dirname, 'views', 'CSSWENG Flowchart.html'));
});

app.get("/api/subjects", async (req, res) => {
    try {
        const subjects = await courses.aggregate([
            {
                $group: {
                    _id: "$subjectabb",
                    ids: { $first: "$_id" },
                    college: { $first: "$college" },
                    subjectabb: { $first: "$subjectabb" },
                    subjectname: { $first: "$subjectname" },
                    subjecttakers: { $sum: "$subjecttakers" },
                    subjectsection: { $addToSet: "$subjectsection" }
                }
            },
            {
                $project: {
                    _id: 0,
                    ids: 1,
                    college: 1,
                    subjectabb: 1,
                    subjectname: 1,
                    subjecttakers: 1,
                    subjectsection: 1
                }
            }
        ]);
        res.json(subjects);
    } catch (error) {
        console.error("Failed to fetch subjects:", error);
        res.status(500).json({ message: "Failed to fetch subjects", error: error.message });
    }
});

app.get("/api/getSubjects", async (req, res) => {
    try {
        const subjects = await courses.find({});
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

app.delete("/deleteSubject/:id", async (req, res) => {
    try {
        console.log(req.params);
        const subjectId = req.params.id;
        console.log(subjectId);
        console.log('Deleting subject with ID:', subjectId);

        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).send({ message: "Invalid ID format" });
        }

        await courses.findByIdAndDelete(subjectId);
        res.json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.error("Error deleting subject:", error.message);
        res.status(500).send({ message: "Error deleting subject", error: error.message });
    }
});

app.get("/api/flowchartdropdown", async (req, res) => {
    try {
        // Fetch distinct college courses from the database
        const courses = await courseFlowchart.distinct('collegecourse');
        res.json(courses.map(course => ({ collegecourse: course })));
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Failed to retrieve courses", error: error.message });
    }
});

app.post("/api/collegecourses", async (req, res) => {
    try {
        const { collegecourse } = req.body;
        console.log("Received collegecourse:", collegecourse);
        
        if (!collegecourse) {
            return res.status(400).json({ message: "No collegecourse provided" });
        }

        const flowchartData = await courseFlowchart.find({ collegecourse }).lean();
        if (flowchartData.length === 0) {
            return res.status(404).json({ message: "No data found for the given collegecourse" });
        }

        res.json(flowchartData);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve data", error: error.message });
    }
});