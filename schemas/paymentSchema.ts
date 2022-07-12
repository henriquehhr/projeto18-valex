import joi from "joi";

export const paymentSchema = joi.object({
    cardId: joi.number().integer().positive().required(),
    businessId: joi.number().integer().positive().required(),
    amount: joi.number().integer().positive().required(),
    password: joi.string().regex(/^[0-9]{4}$/).required()
});