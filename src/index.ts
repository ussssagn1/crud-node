import express, {Request, Response} from 'express'
import bodyParser from "body-parser";

export const app = express()
const port = process.env.PORT || 3000

const jsonBodyMiddleware = bodyParser({})
app.use(jsonBodyMiddleware)

const DB = {
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
app.get('/courses', (req: Request, res: Response) => {
    if(req.query.title) {
        let searchString = req.query.title.toString()
        res.send(DB.courses.filter(p => p.title.indexOf(searchString) > -1))
    } else {
        res.send(DB.courses)
    }
})
app.get('/courses/:id', (req: Request, res: Response) => {
    const foundCourse = DB.courses.find(c => c.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return;
    }

    res.json(foundCourse)
})
app.post('/courses', (req: Request, res: Response) => {
    if(!req.body.title) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }

    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };

    DB.courses.push(createdCourse)
    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(createdCourse)
})
app.delete('/courses/:id', (req: Request, res: Response) => {
    for(let i = 0; i < DB.courses.length; ++i) {
        if(DB.courses[i].id === +req.params.id) {
            DB.courses = DB.courses.filter(c => c.id !== +req.params.id);
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
            return;
        }
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
})
app.put('/courses/:id', (req: Request, res: Response) => {
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