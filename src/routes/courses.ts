import express, {Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {CoursesQueryInputModel} from "../models/CoursesQueryModel";
import {CourseViewModel} from "../models/CourseViewModel";
import {URIParamsCourseldModel} from "../models/URIParamsCourseldModel";
import {CourseCreateInputModel} from "../models/CourseCreateModel";
import {CourseUpdateInputModel} from "../models/CourseUpdateModel";
import {CourseType, DBType} from "../DB/DB";
import {HTTP_STATUSES} from "../utils";
import {coursesRepository} from "../repos/coursesRepository";
import {body, validationResult} from "express-validator";
import {inputValidationMiddlewares} from "../middleware/input-validation-middlewares";

export const getCourseViewModel = (DB_COURSE: CourseType): CourseViewModel => {
    return {
        id: DB_COURSE.id,
        title: DB_COURSE.title
    }
}
const titleValidation = body('title').trim().isLength({
    min: 3,
    max: 30
}).withMessage('title length')

export const getCoursesRouter = (DB:DBType) => {
    const coursesRouter = express.Router();

    coursesRouter.get('/', body('title').isEmpty(),
        async (req: RequestWithQuery<CoursesQueryInputModel>, res: Response<CourseViewModel[]>) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }

        const foundCoursesPromise = coursesRepository.findCourses(req.query.title);
        const foundCourses = await foundCoursesPromise;
        res.status(HTTP_STATUSES.OK_200).send(foundCourses)
    })

    coursesRouter.get('/:id',
        (req: RequestWithParams<URIParamsCourseldModel>, res: Response<CourseViewModel>) => {
        const foundCourse = coursesRepository.getCourseByID(+req.params.id)
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.json(getCourseViewModel(foundCourse))
    })

    coursesRouter.post('/', titleValidation, inputValidationMiddlewares,
        async (req: RequestWithBody<CourseCreateInputModel>, res: Response<CourseViewModel>) => {


        // ERRORS
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        }
        // ERRORS

        if(!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const createdCourse = await coursesRepository.creatCourses(req.body.title) // REPO

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseViewModel(createdCourse))
    })

    coursesRouter.delete('/:id',
        (req: RequestWithParams<URIParamsCourseldModel>, res: Response) => {
        const isDeleted = coursesRepository.deleteCourse(+req.params.id)
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    })

    coursesRouter.put('/:id', titleValidation, inputValidationMiddlewares,
        async (req: RequestWithParamsAndBody<URIParamsCourseldModel, CourseUpdateInputModel>, res: Response) => {
        if(!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const updateResult = await coursesRepository.updateCourse(+req.params.id, req.body.title);

        res.sendStatus(updateResult.status);
    })

    return coursesRouter;
}

export const getInterestingBooksRouter = (DB:DBType) => {
    const coursesRouter = express.Router();

    coursesRouter.get('/books', (req: RequestWithQuery<CoursesQueryInputModel>, res) => {
        res.json({title: 'books'})
    })

    coursesRouter.get('/:id', (req: RequestWithParams<URIParamsCourseldModel>, res) => {

        res.json({title: 'data by id: ' + req.params.id})
    })
    return coursesRouter;
}