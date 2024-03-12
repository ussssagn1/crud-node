import express from "express";
import {getCoursesRouter} from "./routes/courses";
import {getTestsRoutes} from "./routes/tests";
import {DB} from "./DB/DB";

export const app = express()

export const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const coursesRouter = getCoursesRouter(DB)
app.use('/courses', coursesRouter)

const testsRoutes = getTestsRoutes(DB)
app.use('/__test__', testsRoutes)

