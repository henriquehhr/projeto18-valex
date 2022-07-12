import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import { newCardSchema } from "../schemas/newCardSchema.js";
import { newCard, activateCard } from "../controllers/cardController.js";
import { authAPIKey } from "../middlewares/authAPIKey.js";
import { activateCardSchema } from "../schemas/activateCardSchema.js";

const cardsRouter = Router();

cardsRouter.post("/cards/new", schemaValidator(newCardSchema), authAPIKey, newCard);
cardsRouter.put("/cards/activate", schemaValidator(activateCardSchema), activateCard);
cardsRouter.get("/cards");
cardsRouter.get("/cards/balance");
cardsRouter.put("/cards/freeze");
cardsRouter.put("/cards/unfreeze");

export default cardsRouter;