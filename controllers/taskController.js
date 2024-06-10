const UserModel = require('../models/userModel');
const {
  kSuccess,
  kParamMissing,
  kInternalError,
  kNotFound,
} = require('../constants/response');

class TaskController {
  constructor() {}
  async addTask(req, res) {
    try {
      const { subject, deadline, status } = req.body;
      if (!subject || !deadline || !status) return res.send(kParamMissing);
      const _id = req.user._id;
      const user = await UserModel.findByIdAndUpdate(
        _id,
        { $push: { tasks: { subject, deadline, status } } },
        { new: true }
      );
      if (!user) return res.send(kNotFound('User not found'));
      const tasks = user?.tasks;
      const createdTask = tasks[tasks.length - 1];
      res.send({ ...kSuccess, createdTask });
    } catch (error) {
      res.send(kInternalError);
    }
  }
  async getTasks(req, res) {
    try {
      const _id = req.user._id;
      const user = await UserModel.findById(_id, 'tasks');
      if (!user) return res.send(kNotFound('User not found'));
      const tasks = user?.tasks
        .filter((task) => task.isDeleted === false)
        .map((task) => ({
          ...task.toObject(),
          subTasks: task.subTasks.filter(
            (subTask) => subTask.isDeleted == false
          ),
        }));
      if (tasks.length == 0) return res.send(kNotFound('No task found'));
      res.send({ ...kSuccess, tasks });
    } catch (error) {
      res.send(kInternalError);
    }
  }

  async updateTask(req, res) {
    try {
      const taskId = req.params.taskId;
      const { subject, deadline, status } = req.body;
      if (!taskId || !subject || !deadline || !status)
        return res.send(kParamMissing);
      const _id = req.user._id;
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id, tasks: { $elemMatch: { _id: taskId, isDeleted: false } } },
        {
          $set: {
            'tasks.$.subject': req.body.subject,
            'tasks.$.deadline': req.body.deadline,
            'tasks.$.status': req.body.status,
          },
        },
        { new: true }
      );

      if (!updatedUser)
        return res.send(kNotFound('Task is not found or already deleted'));
      const updatedTask = updatedUser.tasks.find(
        (task) => task._id.toString() === taskId
      );
      res.send({ ...kSuccess, updatedTask });
    } catch (error) {
      res.send(kInternalError);
    }
  }
  async deleteTask(req, res) {
    try {
      const taskId = req.params.taskId;
      if (!taskId) return res.send(kParamMissing);
      const _id = req.user._id;
      const user = await UserModel.findOneAndUpdate(
        { _id, tasks: { $elemMatch: { _id: taskId, isDeleted: false } } },
        { $set: { 'tasks.$.isDeleted': true } }
      );
      if (!user)
        return res.send(kNotFound('Task is not found or already deleted'));
      res.send({ ...kSuccess, Response: 'Task deleted successfully' });
    } catch (error) {
      res.send(kInternalError);
    }
  }
  async getSubTasks(req, res) {
    try {
      const taskId = req.params.taskId;
      if (!taskId) return res.send(kParamMissing);
      const _id = req.user._id;
      const user = await UserModel.findOne(
        { _id },
        { tasks: { $elemMatch: { _id: taskId, isDeleted: false } } }
      );
      if (!user?.tasks)
        return res.send(kNotFound('Task is not found or already deleted'));
      const task = user?.tasks[0];
      if (task?.subTasks.length === 0)
        return res.send(kNotFound('No subtask found'));
      const subTasks = task.subTasks.filter(
        (subTask) => subTask.isDeleted === false
      );
      if (subTasks.length === 0)
        return res.send(kNotFound('No subtask found or already deleted'));
      res.send({ ...kSuccess, subTasks });
    } catch (error) {
      res.send(kInternalError);
    }
  }

  async addSubTasks(req, res) {
    try {
      const taskId = req.params.taskId;
      const { subject, deadline, status } = req.body;
      if (!taskId || !subject || !deadline || !status)
        return res.send(kParamMissing);
      const _id = req.user._id;
      const user = await UserModel.findOne(
        { _id },
        { tasks: { $elemMatch: { _id: taskId, isDeleted: false } } }
      );
      if (!user?.tasks)
        return res.send(kNotFound('Task is not found or already deleted'));
      const task = user?.tasks[0];
      const newSubTask = { subject, deadline, status };
      task.subTasks.push(newSubTask);
      await user.save();
      res.send({ ...kSuccess, task: user.tasks[0] });
    } catch (error) {
      res.send(kInternalError);
    }
  }

  async updateSubTasks(req, res) {
    try {
      const taskId = req.params.taskId;
      const subTaskArray = req.body.subTasks;
      if (!taskId || !subTaskArray) return res.send(kParamMissing);
      const _id = req.user._id;
      const user = await UserModel.findOne(
        { _id },
        { tasks: { $elemMatch: { _id: taskId, isDeleted: false } } }
      );
      if (!user?.tasks)
        return res.send(kNotFound('Task is not found or already deleted'));
      const task = user?.tasks[0];
      if (task.subTasks.length == 0)
        return res.send(kNotFound('No subtask found'));
      const subTasks = task.subTasks.filter(
        (subTask) => subTask.isDeleted === false
      );
      if (subTasks.length === 0)
        return res.send(kNotFound('No subtask found or already deleted'));
      for (let i = 0; i < subTasks.length; i++) {
        try {
          const newSubTask = subTaskArray.find(
            (st) => st._id === subTasks[i]._id.toString()
          );
          subTasks[i].subject = newSubTask.subject;
          subTasks[i].deadline = newSubTask.deadline;
          subTasks[i].status = newSubTask.status;
        } catch (error) {}
      }
      await user.save();
      const updatedSubTasks = user?.tasks[0].subTasks.filter(
        (subTask) => subTask.isDeleted === false
      );
      res.send({ ...kSuccess, updatedSubTasks });
    } catch (error) {
      res.send(kInternalError);
    }
  }
}

module.exports = new TaskController();
