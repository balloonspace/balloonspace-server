import Router from "koa-router";

import auth from "./auth";

const api = new Router();

api.get("/", (ctx, next) => {
  ctx.body = "API Page";
});

api.use("/auth", auth.routes());

export default api;
