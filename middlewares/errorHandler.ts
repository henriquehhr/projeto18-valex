import { NextFunction, Request, Response } from "express";

export default function errorHandler(error, req: Request, res: Response, next: NextFunction) {
	console.log("entrou na função");
	console.log(error);
	if (error.type === "Not Found") return res.status(404).send(error.message);

	return res.sendStatus(500);
}