import Joi from "joi";

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
    ctx.body = "Error";
  } else {
    ctx.body = "Success";
  }
};
