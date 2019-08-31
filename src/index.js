import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";

import api from "./api";

const app = new Koa();
const router = new Router();
const models = require("./database/models");

const PORT = 4000;

router.get("/", ctx => {
  ctx.body = "Index Page";
});

router.use("/api", api.routes());

app.use(KoaBody());
app.use(router.routes());

app.listen(PORT, () => {
  console.log(`Server is listening to port ${PORT}`);
});
