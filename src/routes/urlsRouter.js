import { Router } from "express";
import { postShortenUrl } from "../controllers/urlsController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const urlsRouter = Router();
urlsRouter.post('/urls/shorten', validateTokenMiddleware, postShortenUrl);
export default urlsRouter;