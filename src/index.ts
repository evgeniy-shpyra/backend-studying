import { CreateCourseModel } from "./models/CreateCourseModel"
import {
    RequestWithBody,
    RequestWithQuery,
    RequestWithParams,
    RequestWithParamsAndBody,
} from "./types"
import express, { Request, Response } from "express"
import { UpdateCourseModel } from "./models/UpdateCourseModel"
import { QueryCourseModel } from "./models/QueryCourseModel"
import { ViewCourseModel } from "./models/ViewCourseModel"
import { URIParamsCourseIdModel } from "./models/URIParamsCourseIdModel"
const cors = require("cors")

export const app = express()
const port = 3001

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
}

type CourseType = {
    id: number
    title: string
    studentsCount: number
}

const db: { courses: CourseType[] } = {
    courses: [
        { id: 1, title: "front-end", studentsCount: 10 },
        { id: 2, title: "back-end", studentsCount: 10 },
        { id: 3, title: "qa", studentsCount: 10 },
    ],
}

const getCourseViewModel = (dbCourse: CourseType): ViewCourseModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title,
    }
}

const jsonBodyMiddleware = express.json()

app.use(cors())

app.use(jsonBodyMiddleware)

app.get(
    "/courses",
    (
        req: RequestWithQuery<QueryCourseModel>,
        res: Response<ViewCourseModel[]>
    ) => {
        let foundCourses = db.courses

        if (req.query.title)
            foundCourses = foundCourses.filter(
                (item) => item.title.indexOf(req.query.title as string) > -1
            )

        res.json(foundCourses.map((dbCourse) => getCourseViewModel(dbCourse)))
    }
)
app.get(
    "/courses/:id",
    (req: Request<URIParamsCourseIdModel>, res: Response<ViewCourseModel>) => {
        const foundCourse = db.courses.find(
            (item) => item.id === +req.params.id
        )

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.json(getCourseViewModel(foundCourse))
    }
)
app.post(
    "/courses",
    (
        req: RequestWithBody<CreateCourseModel>,
        res: Response<ViewCourseModel>
    ) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }
        const newCourse: CourseType = {
            id: +new Date(),
            title: req.body.title.trim(),
            studentsCount: 0,
        }
        db.courses.push(newCourse)

        res.status(HTTP_STATUSES.CREATED_201).json(getCourseViewModel(newCourse))
    }
)
app.delete(
    "/courses/:id",
    (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
        const indexOfCourse = db.courses.findIndex(
            (item) => item.id === +req.params.id
        )
        if (indexOfCourse < 0) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        db.courses.splice(indexOfCourse, 1)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }
)
app.put(
    "/courses/:id",
    (
        req: RequestWithParamsAndBody<
            URIParamsCourseIdModel,
            UpdateCourseModel
        >,
        res: Response<ViewCourseModel>
    ) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return
        }

        const foundCourse = db.courses.find(
            (item) => item.id === +req.params.id
        )

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        foundCourse.title = req.body.title.trim()

        res.status(204).json(getCourseViewModel(foundCourse))
    }
)

app.delete("/__test__/data", (req, res) => {
    db.courses = []
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})

if (!module.parent) {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
