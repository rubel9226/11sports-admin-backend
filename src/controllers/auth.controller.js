const createError = require("http-errors");
const { successResponse } = require("./response.controllers");

const bcrypt = require('bcryptjs');
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");
const { setAccessTokenCookie, setRefreshTokenCookie } = require("../helper/cookie");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");



const handleLogin =async (req, res, next) => {
    try {
        const {userName, password} = req.body;

        const user = await Admin.findOne({userName: userName});
        if(!user){
            throw createError(404, 'Login name or password is invalid! Please try again.')
        }
        
        // compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            throw createError(401, 'Login password is invalid! Please try again.')
        }

        // is Banned
        if(user.isBanned){
            throw createError(403, 'your are banned. please contact admin');
        }

        // token, cookie, create jwt
        const accessToken = createJSONWebToken({user}, jwtAccessKey, '7d');
        setAccessTokenCookie(res, accessToken); // set access cookie
        
        const refreshToken = createJSONWebToken({user}, jwtRefreshKey, '7d')
        setRefreshTokenCookie(res, refreshToken);


        return successResponse(res, {
            statusCode: 200,
            message: 'User login successfully.',
            payload: user
        })
    } catch (error) {
        next(error)
    }
};



const handleLoginMe = async (req, res, next) => {
    try {
        const user = await Admin.findById(req.user._id).select('-password');

        console.log(user, 'users');
        return successResponse(res, {
            statusCode: 200, 
            message: 'User fetched successfully',
            payload: user,
        })
    } catch (error) {
        next(error)
    }
}


const handleLogout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken')

        // success response
        return successResponse(res, {
            statusCode: 200, 
            message: 'User logged out successfully',
            payload: {  },
        })
    } catch (error) {
        next(error)
    }
}



const handleRefreshToken = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        // verify the old refresh token
        const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
        if(!decodedToken){
            throw createError(401, 'Invalid refresh token. Please login again');
        }
        
        const user = decodedToken.user;
        // create access token
        const accessToken = createJSONWebToken(
            { user }, 
            jwtAccessKey, 
            '15m'
        );
        // set access token on cookie
        setAccessTokenCookie(res, accessToken)

        req.user = decodedToken.user;
        // success response
        return successResponse(res, {
            statusCode: 200, 
            message: 'new access token is genareted',
            payload: {  },
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {handleLogin, handleLogout, handleLoginMe, handleRefreshToken}