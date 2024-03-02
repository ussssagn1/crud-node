import express from 'express'

const app = express()
const port = 3000

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const DB = {
    courses: [
        {id: 1, title: 'front-end'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'devops'},
        {id: 4, title: 'automation qa'}
    ]
};

app.get('/courses', (req, res) => {
    let foundCourse = DB.courses

    if(req.query.title) {
        foundCourse = foundCourse
            .filter(c => c.title.indexOf(req.query.title as string) > -1)
    }

    res.json(foundCourse)
})
app.get('/courses/:id', (req, res) => {
    const foundCourse = DB.courses.find(c => c.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(404)
        return;
    }

    res.json(foundCourse)
})
app.post('/courses', (req, res) => {
    if(!req.body.title) {
        res.sendStatus(400)
        return;
    }

    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };

    DB.courses.push(createdCourse)
    res
        .status(201)
        .json(createdCourse)
})
app.delete('/courses/:id', (req, res) => {
    DB.courses = DB.courses.filter(c => c.id !== +req.params.id);

    res.sendStatus(204)
})
app.put('/courses/:id', (req, res) => {
    if(!req.body.title) {
        res.sendStatus(400)
        return;
    }

    const foundCourse = DB.courses.find(c => c.id === +req.params.id);

    if (!foundCourse) {
        res.sendStatus(404)
        return;
    }

    foundCourse.title = req.body.title;
    res.sendStatus(204)
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})