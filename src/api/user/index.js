import Router from "koa-router";

import * as userController from "./user.ctrl";

const user = new Router();

user.get("/profile/:user_id", userController.getProfile);
user.post("/profile/:user_id", userController.editProfile);

user.post("/follow", userController.follow);
user.post("/unfollow", userController.unfollow);

user.get("/remove", userController.remove);

user.post("/block", userController.block);
user.post("/unblock", userController.unblock);

export default user;
