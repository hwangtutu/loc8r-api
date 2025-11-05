const mongoose = require('mongoose');
const readLine = require('readline');
mongoose.set("strictQuery", false);

const dbURI = 'mongodb+srv://hwangtutu:1234@cluster0.j31ok6r.mongodb.net/Loc8r';
mongoose.connect(dbURI);
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbURI}`);
});
mongoose.connection.on('error', err => {
    console.log(`Mongoose connection error: ${err}`);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});
const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close( () => {
        console.log(`Mongoose disconnected through
${msg}`);
        callback();
    });
};
// For nodemon restarts
process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
// For app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
// For Heroku app termination
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});


// --- Review 서브도큐먼트 스키마 ---
const reviewSchema = new mongoose.Schema({
    author:     { type: String, required: true },
    rating:     { type: Number, required: true, min: 0, max: 5 },
    reviewText: { type: String, required: true },
    createdOn:  { type: Date, default: Date.now }
});

// --- OpeningTimes 서브도큐먼트 스키마 ---
const openingTimeSchema = new mongoose.Schema({
    days:    { type: String, required: true }, // 예: '월-금'
    opening: { type: String },                 // 예: '07:00'
    closing: { type: String },                 // 예: '22:00'
    closed:  { type: Boolean, required: true, default: false }
});

