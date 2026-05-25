const express = require('express');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { handleAddAdmin, handleGetAdmins } = require('../controllers/user.controller');
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

// GET /api/admins
adminRouter.get(
    '/',
    isLoggedIn,
    handleGetAdmins
)






















module.exports = adminRouter;