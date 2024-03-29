import request from 'supertest'
import {CourseCreateInputModel} from "../../src/models/CourseCreateModel";
import {app} from "../../src/app";
import {CourseUpdateInputModel} from "../../src/models/CourseUpdateModel";
import {HTTP_STATUSES} from "../../src/utils";

describe('/courses', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it ('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200)
    })

    it ('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/33333333')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("Shouldn't create course with incorrect input data", async () => {
        const data: CourseCreateInputModel = {title: ''}
        await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    let createdCourseOne: any = null;
    it("Should create course with correct input data", async () => {
        const data: CourseCreateInputModel = {title: 'it-incubator'}
        const createResponse = await request(app)
            .post('/courses')
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourseOne = createResponse.body

        expect(createdCourseOne).toEqual(({
            id: expect.any(Number),
            title: data.title,
        }))

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200)
    })

    it("Shouldn't update course with incorrect input data", async () => {
        const data: CourseUpdateInputModel = {title: ''}

        await request(app)
            .put('/courses/' + createdCourseOne.id)
            .send(data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses/' + createdCourseOne.id)
            .expect(HTTP_STATUSES.OK_200, createdCourseOne)
    })

    it("Shouldn't update course that not exist", async () => {
        const data: CourseUpdateInputModel = {title: 'good'}
        await request(app)
            .put('/courses/' + -100)
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("Should update course with correct input data", async () => {
        const data: CourseUpdateInputModel = {title: 'goodnew'}
        await request(app)
            .put('/courses/' + createdCourseOne.id)
            .send(data)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourseOne.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourseOne,
                title: data.title
            })
    })

    it("Should delete both courses", async () => {
        await request(app)
            .delete(`/courses/` + createdCourseOne.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourseOne.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200)
    })
})