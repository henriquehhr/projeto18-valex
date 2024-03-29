import joi from "joi";

export const activateCardSchema = joi.object({
    cardId: joi.number().integer().positive().required(),
    CVV: joi.string().required(),
    password: joi.string().regex(/^[0-9]{4}$/).required()
});