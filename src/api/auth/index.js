import Router from "koa-router";

import * as authController from "./auth.ctrl";

const auth = new Router();

auth.post("/signup", authController.signUp);

export default auth;
