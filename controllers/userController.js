const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  kSuccess,
  kAlreadyExists,
  kAccessDenied,
  kParamMissing,
  kInternalError,
  kNotFound,
} = require('../constants/response');
const { jwtKey } = require('../config/envConfig');
const saltRounds = 10;
class UserController {
  constructor() {}

  async signUp(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) return res.send(kParamMissing);
      const userExists = await UserModel.findOne({ email });
      if (userExists) return res.send(kAlreadyExists('Email already exists'));
      else {
        const hash = await bcrypt.hash(password, saltRounds);
        const user = await UserModel.create({ name, email, password: hash });
        res.send({ ...kSuccess, user });
      }
    } catch (error) {
      res.send(kInternalError);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.send(kParamMissing);
      const user = await UserModel.findOne({ email });
      if (!user) return res.send(kNotFound('Email not found'));
      else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return res.send(kInternalError);
          if (result == true) {
            const token = jwt.sign({ _id: user._id, name: user.name }, jwtKey, {
              expiresIn: '24h',
            });
            res.send({ ...kSuccess, token });
          } else {
            res.send(kAccessDenied);
          }
        });
      }
    } catch (error) {
      res.send(kInternalError);
    }
  }
}

module.exports = new UserController();
