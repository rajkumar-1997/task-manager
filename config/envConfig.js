const dotenv = require('dotenv');
dotenv.config();

exports.port = process.env.PORT || 3000;
exports.mongodbUrl = process.env.MONGODB_URL;
exports.jwtKey = process.env.JWT_SECRET_KEY;
