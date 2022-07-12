import { Request, Response } from "express";

import * as cardService from "../services/cardService.js"

export async function newCard(req: Request, res: Response) {
    const {employeeId, cardType} = req.body;
    await cardService.newCard(employeeId, cardType, res.locals.company);
    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response) {
    const {cardId, CVV, password} = req.body;
    await cardService.activateCard(cardId, CVV, password);
    res.sendStatus(200);
}