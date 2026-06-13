const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const { handleCreateDeposit, handleCreateWithdraw, handleGetDeposit, handleGetWithdraw } = require('../controllers/deposit.controller');
const { uploadImage } = require('../middlewares/upload');
const depositRouter = express();

// post api/deposit
depositRouter.post(
    '/',
    uploadImage.single('image'),
    isLoggedIn,
    handleCreateDeposit
);


// get api/deposit/
depositRouter.get(
    '/',
    isLoggedIn,
    handleGetDeposit
)


// post api/deposit/withdraw
depositRouter.post(
    '/withdraw', 
    isLoggedIn,
    handleCreateWithdraw
);


// get api/deposit/withdraw
depositRouter.get(
    '/withdraw',
    isLoggedIn,
    handleGetWithdraw
)




module.exports = depositRouter;