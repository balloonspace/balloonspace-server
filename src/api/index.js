import Router from "koa-router";

const api = new Router();

api.get("/", (ctx, next) => {
  ctx.body = "API Page";
});

export default api;
