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
        const subjects = await courses.find({});
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});