import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import { newCardSchema } from "../schemas/newCardSchema.js";
import { newCard, activateCard, freezeCard, unfreezeCard } from "../controllers/cardController.js";
import { authAPIKey } from "../middlewares/authAPIKey.js";
import { activateCardSchema } from "../schemas/activateCardSchema.js";
import { freezeCardSchema } from "../schemas/freezeCardSchema.js";
import { balance } from "../controllers/cardController.js";

const cardsRouter = Router();

cardsRouter.post("/cards/new", schemaValidator(newCardSchema), authAPIKey, newCard);
cardsRouter.put("/cards/activate", schemaValidator(activateCardSchema), activateCard);
//cardsRouter.get("/cards");
cardsRouter.get("/cards/:cardId/balance", balance);
cardsRouter.put("/cards/freeze", schemaValidator(freezeCardSchema), freezeCard);
cardsRouter.put("/cards/unfreeze", schemaValidator(freezeCardSchema) ,unfreezeCard);

export default cardsRouter;