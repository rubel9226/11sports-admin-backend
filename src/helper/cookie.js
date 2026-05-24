const setAccessTokenCookie = (res, accessToken) => {
    res.cookie('accessToken', accessToken, {
        // maxAge: 15 * 60 * 1000, // 15 minutes
        maxAge: 7 * 24* 60 * 60 * 1000, // 7 days
        httpOnly: true,
        // secure: true,
        // sameSite: 'none'
        sameSite: 'lax'
    });
}


const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        maxAge: 7 * 24* 60 * 60 * 1000, // 7 days
        httpOnly: true,
        // secure: true,
        // sameSite: 'none'
        sameSite: 'lax'
    });
}

module.exports = {
    setAccessTokenCookie,
    setRefreshTokenCookie
}