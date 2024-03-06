"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
const utils_1 = require("../../src/utils");
describe('/courses', () => {
    beforeAll(async () => {
        await (0, supertest_1.default)(app_1.app).delete('/__test__/data');
    });
    it('should return 200 and empty array', async () => {
        await (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    });
    it('should return 404 for not existing course', async () => {
        await (0, supertest_1.default)(app_1.app)
            .get('/courses/33333333')
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    });
    it("Shouldn't create course with incorrect input data", async () => {
        const data = { title: '' };
        await (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send(data)
            .expect(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
    });
    let createdCourseOne = null;
    it("Should create course with correct input data", async () => {
        const data = { title: 'it-incubator' };
        const createResponse = await (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send(data)
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        createdCourseOne = createResponse.body;
        expect(createdCourseOne).toEqual(({
            id: expect.any(Number),
            title: data.title,
        }));
        await (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(utils_1.HTTP_STATUSES.OK_200, [createdCourseOne]);
    });
    let createdCourseTwo = null;
    it("create one more course", async () => {
        const data = { title: 'it-incubator TWO' };
        const createResponse = await (0, supertest_1.default)(app_1.app)
            .post('/courses')
            .send(data)
            .expect(utils_1.HTTP_STATUSES.CREATED_201);
        createdCourseTwo = createResponse.body;
        expect(createdCourseTwo).toEqual(({
            id: expect.any(Number),
            title: data.title,
        }));
        await (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(utils_1.HTTP_STATUSES.OK_200, [createdCourseOne, createdCourseTwo]);
    });
    it("Shouldn't update course with incorrect input data", async () => {
        const data = { title: '' };
        await (0, supertest_1.default)(app_1.app)
            .put('/courses/' + createdCourseOne.id)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.BAD_REQUEST_400);
        await (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourseOne.id)
            .expect(utils_1.HTTP_STATUSES.OK_200, createdCourseOne);
    });
    it("Shouldn't update course that not exist", async () => {
        const data = { title: 'good' };
        await (0, supertest_1.default)(app_1.app)
            .put('/courses/' + -100)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
    });
    it("Should update course with correct input data", async () => {
        const data = { title: 'goodnew' };
        await (0, supertest_1.default)(app_1.app)
            .put('/courses/' + createdCourseOne.id)
            .send(data)
            .expect(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        await (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourseOne.id)
            .expect(utils_1.HTTP_STATUSES.OK_200, {
            ...createdCourseOne,
            title: data.title
        });
        await (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourseTwo.id)
            .expect(utils_1.HTTP_STATUSES.OK_200, createdCourseTwo);
    });
    it("Should delete both courses", async () => {
        await (0, supertest_1.default)(app_1.app)
            .delete(`/courses/` + createdCourseOne.id)
            .expect(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        await (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourseOne.id)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        await (0, supertest_1.default)(app_1.app)
            .delete(`/courses/` + createdCourseTwo.id)
            .expect(utils_1.HTTP_STATUSES.NO_CONTENT_204);
        await (0, supertest_1.default)(app_1.app)
            .get('/courses/' + createdCourseTwo.id)
            .expect(utils_1.HTTP_STATUSES.NOT_FOUND_404);
        await (0, supertest_1.default)(app_1.app)
            .get('/courses')
            .expect(utils_1.HTTP_STATUSES.OK_200, []);
    });
});
