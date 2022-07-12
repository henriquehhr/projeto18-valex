import { Request, Response } from "express";

import * as paymentService from "../services/paymentService.js";

export async function payment(req: Request, res: Response) {
    const {cardId, businessId, amount, password} = req.body;
    await paymentService.payment(cardId, businessId, amount, password);
    res.sendStatus(201);
}