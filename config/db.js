const getConfig = require('./config');

const mongoose = require('mongoose');

const config = getConfig(process.env.NODE_ENV);

const connectDb = async() => {
    const conn = await mongoose.connect(config.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`connected: ${conn.connection.host}`);
}

module.exports = connectDb;