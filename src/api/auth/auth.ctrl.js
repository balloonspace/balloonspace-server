import Crypto from "crypto";
import Joi from "joi";

import Models from "../../database/models";
import { generateToken } from "../../jwt";

const { User } = Models;

// POST /api/auth/signup
export const signUp = async ctx => {
  await checkValidSignUpData(ctx.request.body)
    .catch((err) => ctx.throw(err));

  const { user_id, user_pw, nickname } = ctx.request.body;
  let is_exist;

  try {
    is_exist = await User.findOne({ where: { user_id } });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  const hash = Crypto.createHmac("sha512", process.env.HASH_SECRET);

  let new_user;
  const signup_data = {
    user_id,
    nickname,
    user_pw: hash.update(user_pw).digest("base64")
  };

  if (is_exist) {
    // Conflict
    ctx.throw(409);
  } else {
    try {
      new_user = await User.create(signup_data);
    } catch (error) {
      // Internal Server Error
      ctx.throw(500, error);
    }
  }

  console.log(`SignUp: ${new_user.nickname}`);
  ctx.body = new_user;
};

// POST /api/auth/signin
export const signIn = async ctx => {
  await checkValidSignInData(ctx.request.body)
    .catch((err) => ctx.throw(err));

  const hash = Crypto.createHmac("sha512", process.env.HASH_SECRET);

  const { user_id, user_pw } = ctx.request.body;
  let user;

  try {
    user = await User.findOne({ where: { user_id } });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  if (user === null || hash.update(user_pw).digest("base64") !== user.user_pw) {
    // Forbidden
    ctx.throw(403);
  }

  let token;

  try {
    token = await generateToken(user.dataValues);
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  console.log(`Login: ${user.nickname}`);
  ctx.body = token;
};

async function checkValidSignUpData (userData) {
  const valid = Joi.object({
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
  })
  .validate(userData);

  if (valid.error) throw 400;
};

async function checkValidSignInData (userData) {
  const valid = Joi.object({
    user_id: Joi.string()
      .required()
      .min(2)
      .max(30),
    user_pw: Joi.string()
      .required()
      .min(2)
      .max(50)
  })
  .validate(userData);

  if (valid.error) throw 400;
};