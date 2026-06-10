const express = require('express');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { handleAddAdmin, handleGetAdmins, handleGetBalance, handleDepositWithdraw, handleBanUnbanCasino, handleUpdatePassword, handleUpdateStatus, handleTransactionHistory, handleGetSingleAdmin, handleUpdatePasswordByMoreAdmin } = require('../controllers/user.controller');
const { isLoggedIn } = require('../middlewares/auth');
const adminRouter = express.Router();





// POSt /api/admins/register
adminRouter.post(
    '/register', 
    isLoggedIn,
    validateUserRegistration,
    runValidation,
    handleAddAdmin
);


// PUT /api/admins/register
adminRouter.put(
    '/deposit-withdraw/:id', 
    isLoggedIn, 
    handleDepositWithdraw
);


// PUT /api/admins/register
adminRouter.get(
    '/transaction-history/:name', 
    isLoggedIn, 
    handleTransactionHistory
);


// PUT /api/admins/register
adminRouter.put(
    '/casino-ban/:id', 
    isLoggedIn, 
    handleBanUnbanCasino
);


// PUT /api/admins/register
adminRouter.put(
    '/update-status/:id', 
    isLoggedIn, 
    handleUpdateStatus
);


// PUT /api/admins/register
adminRouter.put(
    '/update-password', 
    isLoggedIn, 
    handleUpdatePassword
);


// PUT /api/admins/register
adminRouter.put(
    '/update-password/:name', 
    isLoggedIn, 
    handleUpdatePasswordByMoreAdmin
);


// GET /api/admins
adminRouter.get(
    '/single-admin/:name',
    isLoggedIn,
    handleGetSingleAdmin
);


// GET /api/admins
adminRouter.get(
    '/all-admins/:name',
    isLoggedIn,
    handleGetAdmins
);






module.exports = adminRouter;