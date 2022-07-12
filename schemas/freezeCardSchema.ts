import joi from "joi";

export const freezeCardSchema = joi.object({
    cardId: joi.number().integer().positive().required(),
    password: joi.string().regex(/^[0-9]{4}$/).required()
});