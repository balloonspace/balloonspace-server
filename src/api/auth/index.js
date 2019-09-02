import Router from "koa-router";

import * as authController from "./auth.ctrl";

const auth = new Router();

auth.post("/signup", authController.signUp);
auth.post("/signin", authController.signIn);

export default auth;
