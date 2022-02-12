const userService = require('./user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const verifyController = require('../verify/verify.controller');

module.exports.isAuthenticated = async (req, res, next) => {
  try {
    const verified = await jwt.verify(
      req.headers.token,
      process.env.JWT_SECRET
    );

    if (!verified) {
      return res.status(400).json({
        error: true,
        data: null,
        token: null,
        message: 'user not authenticated',
      });
    }
    req.headers.email = verified.email;
    next();
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: e.message,
      data: undefined,
      token: undefined,
      message: 'something went wrong',
    });
  }
};

const hashPassword = (password, saltRound) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRound, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

module.exports.register = async (req, res) => {
  console.log('register user req received..');
  try {
    const { body } = req;
    const saltRound = 10;
    body.password = await hashPassword(body.password, saltRound);
    const user = await userService.createUser(body);
    const userObj = JSON.parse(JSON.stringify(user));
    delete userObj.password;

    console.log(process.env.JWT_SECRET, 'jwt secret');
    const token = await jwt.sign(
      {
        email: userObj.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    const refresh = await jwt.sign(
      {
        email: userObj.email,
      },
      process.env.REFRESH_SECRET,
    );

    const refreshToken = await userService.addToken({token: refresh});

    // send verification code
    await verifyController.sendVerificationMail(body.email);

    return res.status(200).json({
      error: false,
      token,
      refresh: refreshToken.token,
      message: 'registration completed, verify email to confirm.',
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: e,
      data: null,
      token: null,
      message: 'something went wrong',
    });
  }
};

const comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, match) => {
      if (err) reject(err);
      resolve(match);
    });
  });
};

module.exports.login = async (req, res) => {
  try {
    const user = await userService.findUserByEmail(req.body.email);

    const matchPassword = await comparePassword(
      req.body.password,
      user.password
    );

    if (!matchPassword) {
      return res.status(400).json({
        error: false,
        data: null,
        token: null,
        message: 'User credentials didn\'t matched',
      });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        error: false,
        data: null,
        token: null,
        message: 'User email isn\'t verified',
      });
    }

    const userObj = JSON.parse(JSON.stringify(user));
    delete userObj.password;

    // generate access token
    const token = await jwt.sign(
      {
        data: userObj,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    const refresh = await jwt.sign(
      {
        email: userObj.email,
      },
      process.env.REFRESH_SECRET,
    );
    const refreshToken = await userService.addToken({ token: refresh });

    return res.status(200).json({
      error: false,
      data: null,
      token: token,
      refresh: refreshToken.token,
      message: 'login successful',
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: e,
      data: null,
      token: null,
      message: 'something went wrong',
    });
  }
};

module.exports.logout = async(req, res) => {
  try {
    const token = req.body.token;
    if(!token) return res.status(401).json('No token found');
    await userService.deleteToken(token);
    return res.status(201).json('Successfully logout from this device.');
  } catch (error) {
    console.log('error', error);
    res.status(404).json('something went wrong.');
  }
};

module.exports.refreshToken = async(req, res) => {
  try {
    const token = req.headers.token;
    console.log(token);
    // verify token
    const verified = await jwt.verify(
      token,
      process.env.REFRESH_SECRET
    );

    if (!verified) {
      return res.status(400).json({
        error: true,
        data: null,
        token: null,
        message: 'user not authenticated',
      });
    }
    // extract user email
    const user = await userService.findUserByEmail(verified.email);
    console.log(user);
    // create new access token
    const newToken = await jwt.sign({email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
    // send new token to user
    return res.status(200).json({token: newToken});
  } catch (error) {
    console.log('error', error);
    return res.status(404).json('something went wrong.');
  }
};

module.exports.getCurrentUser = async(req, res) => {
  try {
    const user = await userService.findUserByEmail(req.headers.email);
    delete user.password;
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error); 
    return res.status(404).json('something went wrong.');
  }
};