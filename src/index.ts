import express from "express"
const app = express()
const port = 3000

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
}

const db = {
    courses: [
        { id: 1, title: "front-end" },
        { id: 2, title: "back-end" },
        { id: 3, title: "qa" },
    ],
}

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.get("/courses", (req, res) => {
    let foundCourse = db.courses

    if (req.query.title)
        foundCourse = foundCourse.filter(
            (item) => item.title.indexOf(req.query.title as string) > -1
        )

    res.json(foundCourse)
})
app.get("/courses/:id", (req, res) => {
    const foundCourse = db.courses.find((item) => item.id === +req.params.id)

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    res.json(foundCourse)
})
app.post("/courses", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }
    const newCourse = {
        id: +new Date(),
        title: req.body.title.trim(),
    }
    db.courses.push(newCourse)

    res.status(HTTP_STATUSES.CREATED_201).json(newCourse)
})
app.delete("/courses/:id", (req, res) => {
    const indexOfCourse = db.courses.findIndex(
        (item) => item.id === +req.params.id
    )
    if (indexOfCourse < 0) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    db.courses.splice(indexOfCourse, 1)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
app.put("/courses/:id", (req, res) => {
    if (!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
    }

    const foundCourse = db.courses.find((item) => item.id === +req.params.id)

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

    foundCourse.title = req.body.title.trim()

    res.status(204).json(foundCourse)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
