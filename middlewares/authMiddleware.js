const UserModel = require('../models/userModel');
const { jwtKey } = require('../config/envConfig');
const jwt = require('jsonwebtoken');
const { kAuthorizationFailed } = require('../constants/response');

class AuthMiddleware {
  constructor() {}

  async authenticate(req, res, next) {
    try {
      const token = req.header('Authorization');
      const { _id } = jwt.verify(token, jwtKey);
      const user = await UserModel.findById(_id);
      if (user) {
        req.user = user;
        next();
      } else {
        res.send(kAuthorizationFailed);
      }
    } catch (error) {
      res.send(kAuthorizationFailed);
    }
  }
}
module.exports = new AuthMiddleware();
