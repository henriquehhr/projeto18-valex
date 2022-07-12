import { NextFunction, Request, Response } from "express";
import * as companyRepository from "../repositories/companyRepository.js";

export async function authAPIKey(req: Request, res: Response, next: NextFunction) {
    if(!req.headers["x-api-key"])
        return res.sendStatus(422);
    const company = await companyRepository.findByApiKey(req.headers["x-api-key"].toString());
    if(!company)
        return res.sendStatus(401);
    res.locals.company = company;
    next();
}