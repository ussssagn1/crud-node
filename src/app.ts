import express from "express";
import {getCoursesRoutes} from "./routes/courses";
import {addTestsRoutes} from "./routes/tests";
import {DB} from "./DB/DB";

export const app = express()

export const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

const coursesRouter = getCoursesRoutes(DB)

app.use('/courses', coursesRouter)

addTestsRoutes(app, DB)

