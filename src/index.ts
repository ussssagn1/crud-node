import express, {Request, Response} from 'express'
import bodyParser from "body-parser";
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CourseCreateInputModel} from "./models/CourseCreateModel"; // тип создания
import {CoursesQueryInputModel} from "./models/CoursesQueryModel"; // тип query параметра
import {CourseUpdateInputModel} from "./models/CourseUpdateModel";
import {CourseViewModel} from "./models/CourseViewModel";
import {URIParamsCourseldModel} from "./models/URIParamsCourseldModel"; // тип обновления курса

type CourseType = { // тип курса
    id: number,
    title: string,
}

export const app = express()
const port = process.env.PORT || 3000

const jsonBodyMiddleware = bodyParser({})
app.use(jsonBodyMiddleware)

const DB: { courses: CourseType[]} = { // указываем какой тип у нашего DB.courses
    courses: [
        {id: 1, title: 'front-end'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'devops'},
        {id: 4, title: 'automation qa'}
    ]
};
export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}


app.get('/', (req: Request, res: Response) => {
    res.send("Hi, i'm working")
})
app.get('/courses', (req: RequestWithQuery<CoursesQueryInputModel>, res: Response<CourseViewModel[]>) => {
    req.query.title ? res.send(DB.courses.filter(p => p.title.indexOf(req.query.title) > -1)) : res.send(DB.courses.map(dbCourse => {return {id: dbCourse.id, title: dbCourse.title}}))
})
app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseldModel>, res: Response<CourseViewModel>) => {
    const foundCourse = DB.courses.find(c => c.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }

    res.json({
        id: foundCourse.id,
        title: foundCourse.title
    })
})
app.post('/courses', (req: RequestWithBody<CourseCreateInputModel>, res: Response<CourseViewModel>) => {
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
        .json(createdCourse)
})
app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseldModel>, res) => {
    for(let i = 0; i < DB.courses.length; ++i) {
        if(DB.courses[i].id === +req.params.id) {
            DB.courses = DB.courses.filter(c => c.id !== +req.params.id);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return;
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseldModel, CourseUpdateInputModel>, res) => {
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
app.delete('/__test__/data', (req, res) => {
    DB.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})