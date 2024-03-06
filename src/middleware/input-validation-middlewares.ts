import {NextFunction} from "express";
import {validationResult} from "express-validator";
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../utils";

export const inputValidationMiddlewares = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({errors: errors.array()})
    } else {
        next()
    }
}
