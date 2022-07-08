import { Router } from "express";

const cardsRouter = Router();

cardsRouter.post("/cards/new");
cardsRouter.post("/cards/activate");
cardsRouter.get("/cards");
cardsRouter.get("/cards/balance");
cardsRouter.put("/cards/freeze");
cardsRouter.put("/cards/unfreeze");

export default cardsRouter;