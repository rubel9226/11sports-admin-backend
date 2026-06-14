const express = require('express');
const { isLoggedIn } = require('../middlewares/auth');
const { handleCreateDeposit, handleCreateWithdraw, handleGetDeposit, handleGetWithdraw, handleConfirmDeposit, handleRejectDeposit, handleRejectWithdraw, handleConfirmWithdraw } = require('../controllers/deposit.controller');
const { uploadImage } = require('../middlewares/upload');
const depositRouter = express();

// post api/deposit
depositRouter.post(
    '/',
    uploadImage.single('image'),
    isLoggedIn,
    handleCreateDeposit
);


// put api/deposit
depositRouter.put(
    '/confirm-deposit/:id', 
    isLoggedIn,
    handleConfirmDeposit
);


// put api/deposit
depositRouter.put(
    '/reject-deposit/:id', 
    isLoggedIn,
    handleRejectDeposit
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


depositRouter.put(
    '/confirm-withdraw/:id', 
    isLoggedIn,
    handleConfirmWithdraw
);


// put api/deposit
depositRouter.put(
    '/reject-withdraw/:id', 
    isLoggedIn,
    handleRejectWithdraw
);


// get api/deposit/withdraw
depositRouter.get(
    '/withdraw',
    isLoggedIn,
    handleGetWithdraw
)




module.exports = depositRouter;