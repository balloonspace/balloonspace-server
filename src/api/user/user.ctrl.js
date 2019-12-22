// import Crypto from "crypto";
import Models from "../../database/models";
import { decodeToken } from "../../jwt";
// import { decode } from "punycode";

const { User, Following, Blocking } = Models;

// GET /api/user/profile/:user_id
export const getProfile = async ctx => {
  const { user_id } = ctx.params;
  let user = await User.findOne({
    where: { user_id },
    attributes: { exclude: "user_pw" }
  });
  
  ctx.body = user;
};

// POST /api/user/profile/:user_id
export const editProfile = async ctx => {
  const { token } = ctx.header;
  const data = ctx.request.body;
  let updatedData;

  try {
    await checkRequestVaild(token, null)
    let user = await findUser(token);

    updatedData = await User.update(data, {
      where: { user_id: user.user_id }
    });
  } catch (err) {
    ctx.throw(err);
  }

  ctx.body = updatedData;
};

// POST /api/user/follow
export const follow = async ctx => {
  const { token } = ctx.header;
  const { user_id } = ctx.request.body;
  let new_following;
  let target_id, follower_id;

  try{
    await checkRequestVaild(token, user_id);

    let follower = await findUser(token);
    let target = await User.findOne({ where: { user_id } });

    await checkUserVaild(target, follower);

    target_id = target.user_id;
    follower_id = follower.user_id;

    await checkIdIsAlreadyExist(target_id, follower_id);
  } catch (err){
    ctx.throw(err);
  }

  new_following = await Following.create({ target_id, follower_id });
  ctx.body = new_following;
};

// POST /api/user/unfollow
export const unfollow = async ctx => {
  const { token } = ctx.header;
  const { user_id } = ctx.request.body;

  await checkRequestVaild(token, user_id)
    .catch ((err) => ctx.throw(err));

  let follower = await findUser(token);
  let target = await User.findOne({ where: { user_id } });

  await checkUserVaild(target, follower)
    .catch ((err) => ctx.throw(err));

  const target_id = target.user_id;
  const follower_id = follower.user_id;

  const idIsAlreadyExist = await Following.findOne({
    where: { target_id, follower_id }
  });

  if (idIsAlreadyExist === null) ctx.throw(403);

  let following = await Following.destroy({
    where: { target_id, follower_id }
  }); 

  ctx.body = following;
};

// GET /api/user/remove
export const remove = async ctx => {
  const { token } = ctx.header;

  try {
    await checkRequestVaild(token, null);
  } catch (error) {
    ctx.throw(error);
  }

  let user;

  try {
    user = await findUser(token);
  } catch (error) {
    ctx.throw(error);
  }

  try {
    ctx.body = await User.destroy({ where: { user_id: user.user_id } });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }
};

// POST /api/user/block
export const block = async ctx => {
  const { token } = ctx.header;
  const target_id = ctx.request.body.user_id;

  try {
    await checkRequestVaild(token, target_id);
  } catch (error) {
    ctx.throw(error);
  }

  let user, target;

  try {
    let decoded = await decodeToken(token);

    user = await User.findOne({ where: { user_id: decoded.user_id } });
    target = await User.findOne({ where: { user_id: target_id } });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  try {
    await checkUserVaild(user, target);
  } catch (error) {
    ctx.throw(error);
  }

  let is_exist;

  try {
    is_exist = await Blocking.findOne({
      where: {
        target_id: target.user_id,
        user_id: user.user_id
      }
    });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  let new_blocking;

  if (is_exist) {
    // Conflict
    ctx.throw(409);
  } else {
    try {
      new_blocking = await Blocking.create({
        target_id: target.user_id,
        user_id: user.user_id
      });
    } catch (error) {
      // Internal Server Error
      ctx.throw(500, error);
    }
  }

  ctx.body = new_blocking;
};

// POST /api/user/unblock
export const unblock = async ctx => {
  const { token } = ctx.header;
  const target_id = ctx.request.body.user_id;

  try {
    await checkRequestVaild(token, target_id);
  } catch (error) {
    ctx.throw(error);
  }

  let user, target;

  try {
    let decoded = await decodeToken(token);

    user = await User.findOne({ where: { user_id: decoded.user_id } });
    target = await User.findOne({ where: { user_id: target_id } });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  try {
    await checkUserVaild(target, user);
  } catch (error) {
    ctx.throw(error);
  }

  let is_exist;

  try {
    is_exist = await Blocking.findOne({
      where: {
        target_id: target.user_id,
        user_id: user.user_id
      }
    });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  let blocking;

  if (is_exist === null) {
    // Not Found
    ctx.throw(404);
  } else {
    try {
      blocking = await Blocking.destroy({
        where: {
          target_id: target.user_id,
          user_id: user.user_id
        }
      });
    } catch (error) {
      // Internal Server Error
      ctx.throw(500, error);
    }
  }

  ctx.body = blocking;
};

async function checkRequestVaild(token, user_id) {
  if (token === undefined) throw 401;
  if (user_id === undefined) throw 400;
};

async function checkUserVaild(target, follower) {
  if (target === null) throw 404;
  if (follower.user_id === target.user_id) throw 400;
};

async function findUser(token) {
  let decoded = await decodeToken(token);
  let user = await User.findOne({ where: { user_id: decoded.user_id } });

  if (user === null) throw 404;
  return user;
};

async function checkIdIsAlreadyExist(target_id, follower_id) {
  const idIsAlreadyExist = await Following.findOne({
    where: { target_id, follower_id }
  });

  if (idIsAlreadyExist) throw 409;
};