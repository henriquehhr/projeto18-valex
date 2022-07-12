import { Request, Response } from "express";
import * as rechargeService from "../services/rechargeService.js";

export async function recharge(req: Request, res: Response) {
    const {cardId, amount} = req.body;
    const {company} = res.locals;
    rechargeService.recharge(cardId, amount, company);
    res.sendStatus(201);
}