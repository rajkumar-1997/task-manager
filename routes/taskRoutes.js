const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
class TaskRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post('/', authMiddleware.authenticate, taskController.addTask);
    this.router.get('/', authMiddleware.authenticate, taskController.getTasks);
    this.router.put(
      '/:taskId',
      authMiddleware.authenticate,
      taskController.updateTask
    );
    this.router.delete(
      '/:taskId',
      authMiddleware.authenticate,
      taskController.deleteTask
    );
    this.router.get(
      '/:taskId/subtasks',
      authMiddleware.authenticate,
      taskController.getSubTasks
    );
    this.router.post(
      '/:taskId/subtasks',
      authMiddleware.authenticate,
      taskController.addSubTasks
    );
    this.router.put(
      '/:taskId/subtasks',
      authMiddleware.authenticate,
      taskController.updateSubTasks
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new TaskRoutes().getRouter();
