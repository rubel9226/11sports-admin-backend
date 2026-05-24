const express = require('express');
const createError = require('http-errors');
const { errorResponse } = require('./controllers/response.controllers');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { clientUrl } = require('./secret');



app.use(cors({
    origin: [
        "https://ag11sportslive.vercel.app",
        "http://localhost:3000"
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




const adminRouter = require('./routes/admin.route');
app.use('/api/admins', adminRouter);

const authRouter = require('./routes/auth.route');
app.use('/api/auth', authRouter);



app.use((req, res, next) => {
    next(createError(404, 'route not found'));
});

app.use((err, req, res, next) => {
    return errorResponse(res, {
        statusCode: err.status,
        message: err.message
    });
})










module.exports = app;