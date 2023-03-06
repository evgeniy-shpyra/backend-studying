import { CreateCourseModel } from "./../../src/models/CreateCourseModel"
import request from "supertest"
import { app, HTTP_STATUSES } from "../../src"
import { ViewCourseModel } from "../../src/models/ViewCourseModel"
import { UpdateCourseModel } from "../../src/models/UpdateCourseModel"

describe("/course", () => {
    beforeAll(async () => {
        await request(app).delete("/__test__/data")
    })

    it("should return 200 and empty array", async () => {
        await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, [])
    })

    it("should return 404 for not existing courses", async () => {
        await request(app)
            .get("/courses/232423")
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("should't create course with incorrect input data", async () => {
        const data: CreateCourseModel = { title: "" }

        await request(app)
            .post("/courses")
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .post("/courses")
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, [])
    })

    let createdCourse1: any = null
    let createdCourse2: any = null

    it("should create course with correct input data", async () => {
        const data: CreateCourseModel = { title: "new course" }

        const createdResponse = await request(app)
            .post("/courses")
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse1 = createdResponse.body

        const expectingData: ViewCourseModel = {
            id: expect.any(Number),
            title: data.title,
        }

        expect(createdCourse1).toEqual(expectingData)

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [createdCourse1])
    })

    it("should create one more course", async () => {
        const data: CreateCourseModel = {
            title: "new course2",
        }

        const createdResponse = await request(app)
            .post("/courses")
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourse2 = createdResponse.body

        const expectingData: ViewCourseModel = {
            id: expect.any(Number),
            title: data.title,
        }

        expect(createdCourse2).toEqual(expectingData)

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })

    it("shouldn't update course with incorrect input data", async () => {
        await request(app)
            .put(`/courses/${createdCourse1.id}`)
            .send({ title: "" })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [createdCourse1, createdCourse2])
    })

    it("should update course with that not exist", async () => {
        const data: UpdateCourseModel = {
            title: "good title",
        }

        await request(app)
            .put(`/courses/9999999`)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("should update course with correct input data", async () => {
        const data: UpdateCourseModel = {
            title: "updated title",
        }

        await request(app)
            .put(`/courses/${createdCourse1.id}`)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get("/courses")
            .expect(HTTP_STATUSES.OK_200, [
                { ...createdCourse1, title: data.title },
                createdCourse2,
            ])
    })

    it("should delete both courses", async () => {
        await request(app)
            .delete(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(`/courses/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.OK_200, createdCourse2)

        await request(app)
            .delete(`/courses/${createdCourse1.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`/courses/${createdCourse2.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app).get(`/courses`).expect(HTTP_STATUSES.OK_200, [])
    })
})
