import Router from "koa-router";

import auth from "./auth";
import user from "./user";

const api = new Router();

api.get("/", (ctx, next) => {
  ctx.body = "API Page";
});

api.use("/auth", auth.routes());
api.use("/user", user.routes());

export default api;
