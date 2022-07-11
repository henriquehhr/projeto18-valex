import { Request, Response } from "express";

import * as cardService from "../services/cardService.js"

export async function newCard(req: Request, res: Response) {
    const {employeeId, cardType} = req.body;
    await cardService.newCard(employeeId, cardType, res.locals.company);
    res.sendStatus(201);
}