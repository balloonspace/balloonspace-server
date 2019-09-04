import Models from "../../database/models";
import { decodeToken } from "../../jwt";

const { User, Following } = Models;

// POST /api/user/follow
export const follow = async ctx => {
  const { token } = ctx.header;
  const { user_id } = ctx.request.body;

  let follower, target;

  if (token === undefined) {
    // Unauthorized
    ctx.throw(401);
  } else if (user_id === undefined) {
    // Bad Request
    ctx.throw(400);
  }

  try {
    let decoded = await decodeToken(token);

    follower = await User.findOne({ where: { user_id: decoded.user_id } });
    target = await User.findOne({ where: { user_id } });
  } catch (error) {
    ctx.throw(500, error);
  }

  if (target === null) {
    // Not Found
    ctx.throw(404);
  } else if (follower.user_id === target.user_id) {
    // Bad Request
    ctx.throw(400);
  }

  const target_id = target.user_id;
  const follower_id = follower.user_id;

  const is_exist = await Following.findOne({
    where: { target_id, follower_id }
  });
  let new_following;

  if (is_exist) {
    // Conflict
    ctx.throw(409);
  } else {
    try {
      new_following = await Following.create({ target_id, follower_id });
    } catch (error) {
      // Internal Server Error
      ctx.throw(500, error);
    }
  }

  ctx.body = new_following;
};

// POST /api/user/unfollow
export const unfollow = async ctx => {
  const { token } = ctx.header;
  const { user_id } = ctx.request.body;

  let follower, target;

  if (token === undefined) {
    // Unauthorized
    ctx.throw(401);
  } else if (user_id === undefined) {
    // Bad Request
    ctx.throw(400);
  }

  try {
    let decoded = await decodeToken(token);

    follower = await User.findOne({ where: { user_id: decoded.user_id } });
    target = await User.findOne({ where: { user_id } });
  } catch (error) {
    ctx.throw(500, error);
  }

  if (target === null) {
    // Not Found
    ctx.throw(404);
  } else if (follower.user_id === target.user_id) {
    // Bad Request
    ctx.throw(400);
  }

  const target_id = target.user_id;
  const follower_id = follower.user_id;

  const is_exist = await Following.findOne({
    where: { target_id, follower_id }
  });
  let following;

  if (is_exist === null) {
    // Not Found
    ctx.throw(404);
  } else {
    try {
      following = await Following.destroy({
        where: { target_id, follower_id }
      });
    } catch (error) {
      // Internal Server Error
      ctx.throw(500, error);
    }
  }

  ctx.body = following;
};
