const express = require('express');
const cors = require('cors');
const { port } = require('./config/envConfig');
const databaseConfig = require('./config/databaseConfig');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRoutes);
app.use('/tasks', taskRoutes);
app.get('/', (req, res) => {
  res.status(200).send({ message: 'hello from express app' });
});
const server = async () => {
  try {
    await databaseConfig.connectDb();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log('Error in server start: ', error);
  }
};
server();
