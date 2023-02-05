"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const db = {
    courses: [
        { id: 1, title: "front-end" },
        { id: 2, title: "back-end" },
        { id: 3, title: "qa" },
    ],
};
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
app.get("/courses", (req, res) => {
    let foundCourse = db.courses;
    if (req.query.title)
        foundCourse = foundCourse.filter((item) => item.title.indexOf(req.query.title) > -1);
    res.json(foundCourse);
});
app.get("/courses/:id", (req, res) => {
    const foundCourse = db.courses.find((item) => item.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    res.json(foundCourse);
});
app.post("/courses", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const newCourse = {
        id: +new Date(),
        title: req.body.title.trim(),
    };
    db.courses.push(newCourse);
    res.status(201).json(newCourse);
});
app.delete("/courses/:id", (req, res) => {
    const indexOfCourse = db.courses.findIndex((item) => item.id === +req.params.id);
    if (indexOfCourse < 0) {
        res.sendStatus(404);
        return;
    }
    db.courses.splice(indexOfCourse, 1);
    res.sendStatus(204);
});
app.put("/courses/:id", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const foundCourse = db.courses.find((item) => item.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    foundCourse.title = req.body.title.trim();
    res.json(foundCourse);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
