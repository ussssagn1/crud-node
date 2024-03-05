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

export const getCourseViewModel = (DB_COURSE: CourseType): CourseViewModel => {
    return {
        id: DB_COURSE.id,
        title: DB_COURSE.title
    }
}

export const getCoursesRouter = (DB:DBType) => {
    const coursesRouter = express.Router();

    coursesRouter.get('/', (req: RequestWithQuery<CoursesQueryInputModel>, res: Response<CourseViewModel[]>) => {
        const foundCourses = coursesRepository.findCourses(req.query.title)
        res.send(foundCourses)
    })

    coursesRouter.get('/:id', (req: RequestWithParams<URIParamsCourseldModel>, res: Response<CourseViewModel>) => {
        const foundCourse = coursesRepository.getCourseByID(+req.params.id)
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        res.json(getCourseViewModel(foundCourse))
    })

    coursesRouter.post('/', (req: RequestWithBody<CourseCreateInputModel>, res: Response<CourseViewModel>) => {
        if(!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const createdCourse = coursesRepository.creatCourses(req.body.title) // REPO

        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseViewModel(createdCourse))
    })

    coursesRouter.delete('/:id', (req: RequestWithParams<URIParamsCourseldModel>, res: Response) => {
        const isDeleted = coursesRepository.deleteCourse(+req.params.id)
        isDeleted ? res.sendStatus(HTTP_STATUSES.NO_CONTENT_204) : res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)

    })

    coursesRouter.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseldModel, CourseUpdateInputModel>, res: Response) => {
        if(!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const updateResult = coursesRepository.updateCourse(+req.params.id, req.body.title);

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