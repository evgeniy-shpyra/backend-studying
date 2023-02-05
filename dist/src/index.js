"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const port = 3000;
const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
};
const db = {
    courses: [
        { id: 1, title: "front-end" },
        { id: 2, title: "back-end" },
        { id: 3, title: "qa" },
    ],
};
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.get("/courses", (req, res) => {
    let foundCourse = db.courses;
    if (req.query.title)
        foundCourse = foundCourse.filter((item) => item.title.indexOf(req.query.title) > -1);
    res.json(foundCourse);
});
exports.app.get("/courses/:id", (req, res) => {
    const foundCourse = db.courses.find((item) => item.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    res.json(foundCourse);
});
exports.app.post("/courses", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const newCourse = {
        id: +new Date(),
        title: req.body.title.trim(),
    };
    db.courses.push(newCourse);
    res.status(HTTP_STATUSES.CREATED_201).json(newCourse);
});
exports.app.delete("/courses/:id", (req, res) => {
    const indexOfCourse = db.courses.findIndex((item) => item.id === +req.params.id);
    if (indexOfCourse < 0) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    db.courses.splice(indexOfCourse, 1);
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
exports.app.put("/courses/:id", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
        return;
    }
    const foundCourse = db.courses.find((item) => item.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }
    foundCourse.title = req.body.title.trim();
    res.status(204).json(foundCourse);
});
exports.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
