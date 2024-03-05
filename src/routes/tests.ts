import {DBType} from "../DB/DB";
import {HTTP_STATUSES} from "../utils";
import express from "express";

export const getTestsRoutes = (DB: DBType) => {
    const router = express.Router()

    router.delete('/data', (req, res) => {
        DB.courses = [];
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })

    return router;
}
