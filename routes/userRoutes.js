const express = require('express');
const userController = require('../controllers/userController');

class UserRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/signup', userController.signUp);
    this.router.post('/login', userController.login);
  }
  getRouter() {
    return this.router;
  }
}
module.exports = new UserRoutes().getRouter();
