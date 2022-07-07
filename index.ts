import express from "express";
import "express-async-errors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Server live at port: ${port}`));