import { Router } from "express";
import { recharge } from "../controllers/rechargeController.js";
import { authAPIKey } from "../middlewares/authAPIKey.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import { rechargeSchema } from "../schemas/rechargeSchema.js";

const rechargesRouter = Router();

rechargesRouter.post("/recharges", schemaValidator(rechargeSchema), authAPIKey, recharge);

export default rechargesRouter;