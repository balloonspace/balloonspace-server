import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";
import api from "./api";

import dotenv from "dotenv"
dotenv.config();

const app = new Koa();
const router = new Router();

const { PORT = 4000 } = process.env;

router.get("/", ctx => { ctx.body = { "data": "Index Page" } });
router.use("/api", api.routes());

app.use(KoaBody());
app.use(router.routes());
app.use(router.allowedMethods({ throw: true }));

const server = app.listen(PORT, () => {
  console.log(`🔥🔥 Server is listening to http://localhost:${PORT}`);
});

module.exports = server;