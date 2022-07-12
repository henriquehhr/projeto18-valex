import { Router } from "express";

import { payment } from "../controllers/paymentController.js";
import schemaValidator from "../middlewares/schemaValidator.js";
import { paymentSchema } from "../schemas/paymentSchema.js";

const paymentsRouter = Router();

paymentsRouter.post("/payments", schemaValidator(paymentSchema), payment);

export default paymentsRouter;