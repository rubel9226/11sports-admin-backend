const express = require('express');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { handleAddAdmin, handleGetAdmins, handleGetBalance, handleDepositWithdraw, handleBanUnbanCasino, handleUpdatePassword, handleUpdateStatus, handleTransactionHistory } = require('../controllers/user.controller');
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
    '/transaction-history', 
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

// GET /api/admins
adminRouter.get(
    '/',
    isLoggedIn,
    handleGetAdmins
)


// GET /api/admins
// adminRouter.get(
//     '/',
//     isLoggedIn,
//     handleGetBalance
// );






















module.exports = adminRouter;