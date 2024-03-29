import joi from "joi";

export const rechargeSchema = joi.object({
    cardId: joi.number().integer().positive().required(),
    amount: joi.number().integer().positive().required()
});