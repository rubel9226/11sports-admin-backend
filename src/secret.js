require('dotenv').config();
const serverPort = process.env.SERVER_PORT || 5001;
const mongodbURL = process.env.MONGODB_ATLAS_URL || 'mongodb://localhost:27017/tuhin_ecommerce';

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || 'ahahihaighaigag_28y145dshd';
const jwtAccessKey = process.env.JWT_ACCESS_KEY || 'ahahihaighaigag_28y145dshd';
const jwtRefreshKey = process.env.JWT_REFRESH_KEY || 'ahahihaighaigag_28y145dshd';
const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || 'ahahihaighaigag_28y145dshd';



module.exports = {
    serverPort,
    mongodbURL,
    clientUrl,
    jwtActivationKey,
    jwtAccessKey,
    jwtRefreshKey,
    jwtResetPasswordKey,
}