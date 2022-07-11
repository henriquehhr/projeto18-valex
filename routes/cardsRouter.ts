import { Router } from "express";
import schemaValidator from "../middlewares/schemaValidator.js";
import { newCardSchema } from "../schemas/newCardSchema.js";
import { newCard } from "../controllers/cardController.js";
import { authAPIKey } from "../middlewares/authAPIKey.js";

const cardsRouter = Router();

cardsRouter.post("/cards/new", schemaValidator(newCardSchema), authAPIKey, newCard);
cardsRouter.post("/cards/activate");
cardsRouter.get("/cards");
cardsRouter.get("/cards/balance");
cardsRouter.put("/cards/freeze");
cardsRouter.put("/cards/unfreeze");

export default cardsRouter;