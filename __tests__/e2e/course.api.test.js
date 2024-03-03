"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
(0, node_test_1.describe)('/course', () => {
    beforeAll(async () => {
        await (0, supertest_1.default)(src_1.app).delete('/__test__/data');
    });
    it('should return 200 and empty array', async () => {
        await (0, supertest_1.default)(src_1.app)
            .get('/courses')
            .expect(src_1.HTTP_STATUSES.OK_200, []);
    });
    it('should return 404 for not existing course', async () => {
        await (0, supertest_1.default)(src_1.app)
            .get('/courses/33333333')
            .expect(src_1.HTTP_STATUSES.NOT_FOUND_404);
    });
    it("Shouldn't create course with correct input data", async () => {
        await (0, supertest_1.default)(src_1.app)
            .post('/courses')
            .send({ title: '' })
            .expect(src_1.HTTP_STATUSES.BAD_REQUEST_400);
    });
    it("Should create course with correct input data", async () => {
        const createResponse = await (0, supertest_1.default)(src_1.app)
            .post('/courses')
            .send({ title: 'it-incubator' })
            .expect(src_1.HTTP_STATUSES.CREATED_201);
        const createdCourse = createResponse.body;
        expect(createdCourse).toEqual(({
            id: expect.any(Number),
            title: 'it-incubator',
        }));
    });
});
