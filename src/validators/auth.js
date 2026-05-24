const { body } = require("express-validator");




const validateUserRegistration = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required.')
        .isEmail()
        .withMessage('Enter Valid Email.'),
    body('userName')
        .trim()
        .notEmpty()
        .withMessage('User name is required. Enter your full name')
        .isLength({min: 3, max: 31})
        .withMessage('User name should be at least 3-31 characters long.'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('password is required. Enter your full name')
        .isLength({min: 6})
        .withMessage('password should be at least 6 numbers long.'),
];



// login validation
const validateUserLogin = [
    body('userName')
        .trim()
        .notEmpty()
        .withMessage('User Name is required.'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required.')
        .isLength({min: 6})
        .withMessage('password should be at least 6 characters long'),
];



module.exports = { validateUserRegistration, validateUserLogin }