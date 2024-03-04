import express, {Express, Request, Response} from "express";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "../types";
import {CoursesQueryInputModel} from "../models/CoursesQueryModel";
import {CourseViewModel} from "../models/CourseViewModel";
import {URIParamsCourseldModel} from "../models/URIParamsCourseldModel";
import {CourseCreateInputModel} from "../models/CourseCreateModel";
import {CourseUpdateInputModel} from "../models/CourseUpdateModel";
import {CourseType, DB, DBType} from "../DB/DB";
import {HTTP_STATUSES} from "../statuses";

export const getCourseViewModel = (DB_COURSE: CourseType): CourseViewModel => {
    return {
        id: DB_COURSE.id,
        title: DB_COURSE.title
    }
}

export const getCoursesRoutes = (DB:DBType) => {
    const coursesRouter = express.Router();

    coursesRouter.get('/', (req: RequestWithQuery<CoursesQueryInputModel>, res: Response<CourseViewModel[]>) => {
        req.query.title ? res.send(DB.courses.filter(p => p.title.indexOf(req.query.title) > -1)) : res.send(DB.courses.map(getCourseViewModel))
    })

    coursesRouter.get('/:id', (req: RequestWithParams<URIParamsCourseldModel>, res: Response<CourseViewModel>) => {
        const foundCourse = DB.courses.find(c => c.id === +req.params.id);

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

        const createdCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
        };

        DB.courses.push(createdCourse)
        res
            .status(HTTP_STATUSES.CREATED_201)
            .json(getCourseViewModel(createdCourse))
    })

    coursesRouter.delete('/:id', (req: RequestWithParams<URIParamsCourseldModel>, res: Response) => {
        for(let i = 0; i < DB.courses.length; ++i) {
            if(DB.courses[i].id === +req.params.id) {
                DB.courses = DB.courses.filter(c => c.id !== +req.params.id);
                res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
                return;
            }
        }
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    })

    coursesRouter.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseldModel, CourseUpdateInputModel>, res: Response) => {
        if(!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const foundCourse = DB.courses.find(c => c.id === +req.params.id);

        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }

        foundCourse.title = req.body.title;
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return coursesRouter;
}