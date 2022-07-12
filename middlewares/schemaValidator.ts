import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

export default function schemaValidator (schema: Schema) {
    
    function customSchemaValidator(req: Request, res: Response, next: NextFunction) { 
        const {error} = schema.validate(req.body, {abortEarly: false});
        if (error)
            return res.status(422).send(error.details.map(detail => detail.message));
        next();
        console.log("Passou na validação de esquemas");
    }

    return customSchemaValidator;
} 