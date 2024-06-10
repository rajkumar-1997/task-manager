const mongoose = require('mongoose');
const { Schema } = mongoose;

class UserSchema {
  constructor() {
    this.subTasksSchema = new Schema({
      subject: { type: String, required: true },
      deadline: { type: String, required: true },
      status: { type: String, required: true },
      isDeleted: { type: Boolean, default: false },
    });
    this.taskSchema = new Schema({
      subject: { type: String, required: true },
      deadline: { type: String, required: true },
      status: { type: String, required: true },
      isDeleted: { type: Boolean, default: false },
      subTasks: [this.subTasksSchema],
    });
    this.schema = new Schema(
      {
        name: { type: String, required: true, uppercase: true },
        email: { type: String, required: true, lowercase: true },
        password: { type: String, required: true },
        tasks: [this.taskSchema],
      },
      {
        timestamps: true,
      }
    );
  }

  getModel() {
    return mongoose.model('User', this.schema);
  }
}

const UserModel = new UserSchema().getModel();
module.exports = UserModel;
