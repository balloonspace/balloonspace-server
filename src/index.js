import Koa from "koa";
import Router from "koa-router";
import KoaBody from "koa-body";
import dotenv from "dotenv";

import api from "./api";

dotenv.config();

const app = new Koa();
const router = new Router();

const { PORT = 4000 } = process.env;

router.get("/", ctx => {
  ctx.body = "Index Page";
});

router.use("/api", api.routes());

app.use(KoaBody());
app.use(router.routes());
app.use(router.allowedMethods({throw: true}));

app.listen(PORT, () => {
  console.log(`Server is listening to http://localhost:${PORT}`);
});
