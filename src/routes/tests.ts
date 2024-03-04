import {DBType} from "../DB/DB";
import {HTTP_STATUSES} from "../statuses";
import {Express} from "express";

export const addTestsRoutes = (app: Express, DB: DBType) => {
    app.delete('/__test__/data', (req, res) => {
        DB.courses = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

}
