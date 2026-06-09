const setAccessTokenCookie = (res, accessToken) => {
    res.cookie('accessToken', accessToken, {
        maxAge: 15 * 60 * 1000, // 15 minutes
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: "/",
        // sameSite: 'lax'
    });
}


const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
        maxAge: 7 * 24* 60 * 60 * 1000, // 7 days
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: "/",
        // sameSite: 'lax'
    });
}

module.exports = {
    setAccessTokenCookie,
    setRefreshTokenCookie
}