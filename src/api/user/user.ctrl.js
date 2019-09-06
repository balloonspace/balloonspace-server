import Models from "../../database/models";
import { decodeToken } from "../../jwt";

const { User, Following, Blocking } = Models;

// GET /api/user/profile/:user_id
export const getProfile = async ctx => {
  const { user_id } = ctx.params;
  let user;

  try {
    user = await User.findOne({
      where: { user_id },
      attributes: { exclude: "user_pw" }
    });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  ctx.body = user;
};

// POST /api/user/profile/:user_id
export const editProfile = async ctx => {
  const { token } = ctx.header;
  const data = ctx.request.body;

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
    ctx.body = await User.update(data, {
      where: { user_id: user.user_id }
    });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }
};

// POST /api/user/follow
export const follow = async ctx => {
  const { token } = ctx.header;
  const { user_id } = ctx.request.body;

  try {
    await checkRequestVaild(token, user_id);
  } catch (error) {
    ctx.throw(error);
  }

  let follower, target;

  try {
    let decoded = await decodeToken(token);

    follower = await User.findOne({ where: { user_id: decoded.user_id } });
    target = await User.findOne({ where: { user_id } });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  try {
    await checkUserVaild(target, follower);
  } catch (error) {
    ctx.throw(error);
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

  try {
    await checkRequestVaild(token, user_id);
  } catch (error) {
    ctx.throw(error);
  }

  let follower, target;

  try {
    let decoded = await decodeToken(token);

    follower = await User.findOne({ where: { user_id: decoded.user_id } });
    target = await User.findOne({ where: { user_id } });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

  try {
    await checkUserVaild(target, follower);
  } catch (error) {
    ctx.throw(error);
  }

  const target_id = target.user_id;
  const follower_id = follower.user_id;

  let is_exist;

  try {
    is_exist = await Following.findOne({
      where: { target_id, follower_id }
    });
  } catch (error) {
    // Internal Server Error
    ctx.throw(500, error);
  }

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
  if (token === undefined) {
    // Unauthorized
    throw 401;
  } else if (user_id === undefined) {
    // Bad Request
    throw 400;
  }
}

async function checkUserVaild(target, follower) {
  if (target === null) {
    // Not Found
    throw 404;
  } else if (follower.user_id === target.user_id) {
    // Bad Request
    throw 400;
  }
}

async function findUser(token) {
  let user;

  try {
    let decoded = await decodeToken(token);

    user = await User.findOne({ where: { user_id: decoded.user_id } });
  } catch (error) {
    // Internal Server Error
    throw 500;
  }

  if (user === null) {
    // Not Found
    throw 404;
  }

  return user;
}
