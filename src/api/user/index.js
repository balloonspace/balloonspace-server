import Router from "koa-router";

import * as userController from "./user.ctrl";

const user = new Router();

user.get("/profile/:user_id", userController.getProfile);
user.post("/profile/:user_id", userController.editProfile);

user.post("/follow", userController.follow);
user.post("/unfollow", userController.unfollow);

user.get("/leave", userController.leave);

export default user;
