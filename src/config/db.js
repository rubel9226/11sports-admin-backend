const mongoose = require('mongoose');
const { mongodbURL } = require('../secret');



const connectDatabase = async (options = {}) => {
    try {
        await mongoose.connect(mongodbURL, options)
        console.log('Connections to DB is successfully.');

        mongoose.connection.on('error', (error) => {
            console.log('DB connection error: ', error);
        });
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDatabase;