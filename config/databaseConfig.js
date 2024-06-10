const mongoose = require('mongoose');
const { mongodbUrl } = require('./envConfig');
class DatabaseConfig {
  async connectDb() {
    try {
      await mongoose.connect(mongodbUrl);
      console.log('database connected');
    } catch (error) {
      console.log('Error in database connection: ', error);
    }
  }
}

module.exports = new DatabaseConfig();
