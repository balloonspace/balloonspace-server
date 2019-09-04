import Router from "koa-router";

import * as userController from "./user.ctrl";

const user = new Router();

user.post("/follow", userController.follow);
user.post("/unfollow", userController.unfollow);

export default user;
