const express = require('express');
const authRouter = express.Router();

const { isLoggedOut, isLoggedIn, verifyToken } = require('../middlewares/auth');
const runValidation = require('../validators');
const { handleLogin, handleLogout, handleLoginMe, handleRefreshToken } = require('../controllers/auth.controller');
const { validateUserLogin } = require('../validators/auth')





// post /api/auth/login
authRouter.post(
    '/login',
    validateUserLogin,
    runValidation,
    isLoggedOut,
    handleLogin
);

// get /api/auth/me
authRouter.get('/me', verifyToken, handleLoginMe)


authRouter.post('/logout', isLoggedIn, handleLogout);


authRouter.get('/refresh-token', handleRefreshToken);













module.exports = authRouter;