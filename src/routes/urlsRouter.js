import { Router } from "express";
import { deleteUrl, getShortUrl, postShortenUrl } from "../controllers/urlsController.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";

const urlsRouter = Router();
urlsRouter.post('/urls/shorten', validateTokenMiddleware, postShortenUrl);
urlsRouter.get('/urls/:shortUrl', getShortUrl);
urlsRouter.delete('/urls/:id', validateTokenMiddleware, deleteUrl);
export default urlsRouter;