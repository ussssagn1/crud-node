import {describe} from "node:test";
import request from 'supertest'
import {app, HTTP_STATUSES} from "../../src";

describe('/course', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    let createdCourseOne: any = null;
    let createdCourseTwo: any = null;

    it ('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it ('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/33333333')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("Shouldn't create course with incorrect input data", async () => {
        await request(app)
            .post('/courses')
            .send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)
    })

    it("Should create course with correct input data", async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({title: 'it-incubator'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourseOne = createResponse.body

        expect(createdCourseOne).toEqual(({
            id: expect.any(Number),
            title: 'it-incubator',
        }))

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourseOne])
    })

    it("create one more course", async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({title: 'it-incubator TWO'})
            .expect(HTTP_STATUSES.CREATED_201)

        createdCourseTwo = createResponse.body

        expect(createdCourseTwo).toEqual(({
            id: expect.any(Number),
            title: 'it-incubator TWO',
        }))

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [createdCourseOne, createdCourseTwo])
    })

    it("Shouldn't update course with incorrect input data", async () => {
        await request(app)
            .put('/courses/' + createdCourseOne.id)
            .send({title: ''})
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/courses/' + createdCourseOne.id)
            .expect(HTTP_STATUSES.OK_200, createdCourseOne)
    })

    it("Shouldn't update course that not exist", async () => {
        await request(app)
            .put('/courses/' + -100)
            .send({title: 'good'})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it("Should update course with correct input data", async () => {
        await request(app)
            .put('/courses/' + createdCourseOne.id)
            .send({title: 'goodNew'})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourseOne.id)
            .expect(HTTP_STATUSES.OK_200, {
                ...createdCourseOne,
                title: 'goodNew'
            })

        await request(app)
            .get('/courses/' + createdCourseTwo.id)
            .expect(HTTP_STATUSES.OK_200, createdCourseTwo)
    })

    it("Should delete both courses", async () => {
        await request(app)
            .delete(`/courses/` + createdCourseOne.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourseOne.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`/courses/` + createdCourseTwo.id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get('/courses/' + createdCourseTwo.id)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUSES.OK_200, [])
    })
})