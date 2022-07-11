import joi from "joi";
import { cardTypes } from "../repositories/cardRepository.js";

export const newCardSchema = joi.object({
    employeeId: joi.number().integer().positive().required(),
    cardType: joi.string().valid(...cardTypes),
});