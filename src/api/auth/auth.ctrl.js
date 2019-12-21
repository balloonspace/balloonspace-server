import Crypto from "crypto";
import Joi from "joi";

import Models from "../../database/models";
import { generateToken } from "../../jwt";

const { User } = Models;

// POST /api/auth/signup
export const signUp = async ctx => {
  const { user_id, user_pw, nickname } = ctx.request.body;

  await checkValidSignUpData(ctx.request.body)
    .catch( (err) => ctx.throw(err) );

  let userIdAleadyExist = await User.findOne({ where: { user_id } })
  if (userIdAleadyExist) ctx.throw(409);
    
  const hash = Crypto.createHmac("sha512", process.env.HASH_SECRET);
  const hashed_user_pw = hash.update(user_pw).digest("base64");

  const signup_data = { user_id, nickname, hashed_user_pw };
  let new_user = await User.create(signup_data);

  console.log(`SignUp: ${new_user.nickname}`);
  ctx.body = new_user;
};

// POST /api/auth/signin
export const signIn = async ctx => {
  const { user_id, user_pw } = ctx.request.body;

  await checkValidSignInData(ctx.request.body)
    .catch((err) => ctx.throw(err));

  const hash = Crypto.createHmac("sha512", process.env.HASH_SECRET);
  const hashed_user_pw = hash.update(user_pw).digest("base64");
  
  let user = await User.findOne({ where: { user_id } });
  
  const userIdNotFound = (user === null);
  const pwNotCorrect = (hashed_user_pw !== user.user_pw);
  if (userIdNotFound || pwNotCorrect) ctx.throw(403);

  let token = await generateToken(user.dataValues);
  
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