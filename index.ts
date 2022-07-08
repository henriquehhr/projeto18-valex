import express, {json} from "express";
import "express-async-errors";
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";

dotenv.config();
const app = express();

app.use(json());
app.use(router);
app.use(errorHandler);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server live at port: ${port}`));