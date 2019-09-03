import Crypto from "crypto";
import Joi from "joi";

import Models from "../../database/models";
import * as jwt from "../../jwt";

const { User } = Models;

// POST /api/auth/signup
export const signUp = async ctx => {
  const vaild = Joi.object({
    user_id: Joi.string()
      .required()
      .min(2)
      .max(30),
    user_pw: Joi.string()
      .required()
      .min(2)
      .max(50),
    nickname: Joi.string()
      .required()
      .min(2)
      .max(20)
  }).validate(ctx.request.body);

  if (vaild.error) {
    // Bad Request
    ctx.status = 400;
    return;
  }

  let { user_id, user_pw, nickname } = ctx.request.body;
  let is_exist;

  try {
    is_exist = await User.findOne({ where: { user_id } });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  const hash = Crypto.createHmac("sha512", process.env.HASH_SECRET);

  let new_user;
  let signup_data = {
    user_id,
    nickname,
    user_pw: hash.update(user_pw).digest("base64")
  };

  if (is_exist) {
    // Conflict
    ctx.status = 409;
    return;
  } else {
    try {
      new_user = await User.create(signup_data);
    } catch (error) {
      ctx.throw(500, error);
    }
  }

  console.log(`SignUp: ${new_user.nickname}`);
  ctx.body = new_user;
};

// POST /api/auth/signin
export const signIn = async ctx => {
  const vaild = Joi.object({
    user_id: Joi.string()
      .required()
      .min(2)
      .max(30),
    user_pw: Joi.string()
      .required()
      .min(2)
      .max(50)
  }).validate(ctx.request.body);

  if (vaild.error) {
    // Bad Request
    ctx.status = 400;
    return;
  }

  const hash = Crypto.createHmac("sha512", process.env.HASH_SECRET);

  let { user_id, user_pw } = ctx.request.body;
  let user;

  try {
    user = await User.findOne({ where: { user_id } });
  } catch (error) {
    ctx.throw(500, error);
  }

  if (!user || hash.update(user_pw).digest("base64") !== user.user_pw) {
    // Forbidden
    ctx.status = 403;
    return;
  }

  let token;

  try {
    token = await jwt.generateToken(user.dataValues);
  } catch (error) {
    ctx.throw(500, error);
  }

  console.log(`Login: ${user.nickname}`);
  ctx.body = token;
};
