const express = require('express');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const { handleAddAdmin } = require('../controllers/user.controller');
const { isLoggedIn } = require('../middlewares/auth');
const adminRouter = express.Router();






adminRouter.post(
    '/register', 
    isLoggedIn,
    validateUserRegistration,
    runValidation,
    handleAddAdmin
);






















module.exports = adminRouter;