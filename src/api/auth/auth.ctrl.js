import Joi from "joi";

import Models from "../../database/models";

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

  let { user_id } = ctx.request.body;
  let isExist;

  try {
    isExist = await User.findOne({ where: { user_id } });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  let newUser;

  if (isExist) {
    // Conflict
    ctx.status = 409;
    return;
  } else {
    try {
      newUser = await User.create(ctx.request.body);
    } catch (error) {
      ctx.throw(500, error);
    }
  }

  ctx.body = newUser;
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

  let { user_id, user_pw } = ctx.request.body;
  let user;

  try {
    user = await User.findOne({ where: { user_id } });
  } catch (error) {
    ctx.throw(500, error);
  }

  if (!user || user.user_pw !== user_pw) {
    // Forbidden
    ctx.status = 403;
    return;
  }

  ctx.body = user;
};
