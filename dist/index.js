"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUSES = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors = require("cors");
exports.app = (0, express_1.default)();
const port = 3001;
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
const db = {
    courses: [
        { id: 1, title: "front-end", studentsCount: 10 },
        { id: 2, title: "back-end", studentsCount: 10 },
        { id: 3, title: "qa", studentsCount: 10 },
    ],
};
const getCourseViewModel = (dbCourse) => {
    return {
        id: dbCourse.id,
        title: dbCourse.title,
    };
};
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(cors());
exports.app.use(jsonBodyMiddleware);
exports.app.get("/courses", (req, res) => {
    let foundCourses = db.courses;
    if (req.query.title)
        foundCourses = foundCourses.filter((item) => item.title.indexOf(req.query.title) > -1);
    res.json(foundCourses.map((dbCourse) => getCourseViewModel(dbCourse)));
});
exports.app.get("/courses/:id", (req, res) => {
    const foundCourse = db.courses.find((item) => item.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(getCourseViewModel(foundCourse));
});
exports.app.post("/courses", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const newCourse = {
        id: +new Date(),
        title: req.body.title.trim(),
        studentsCount: 0,
    };
    db.courses.push(newCourse);
    res.status(exports.HTTP_STATUSES.CREATED_201).json(getCourseViewModel(newCourse));
});
exports.app.delete("/courses/:id", (req, res) => {
    const indexOfCourse = db.courses.findIndex((item) => item.id === +req.params.id);
    if (indexOfCourse < 0) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    db.courses.splice(indexOfCourse, 1);
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.put("/courses/:id", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(exports.HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const foundCourse = db.courses.find((item) => item.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(exports.HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title.trim();
    res.status(204).json(getCourseViewModel(foundCourse));
});
exports.app.delete("/__test__/data", (req, res) => {
    db.courses = [];
    res.sendStatus(exports.HTTP_STATUSES.NO_CONTENT_204);
});
if (!module.parent) {
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
