const jwt = require('jsonwebtoken');

module.exports.checkAuth = async (req, res, next) =>
{
    const token = req.cookies?.token;
    if(!token)
    {
        return res.json({
            success: false,
            message: 'No auth token found.'
        }).status(400);
    }

    try{
        const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = verifiedToken.user;

        next();
    } catch(err)
    {
        return res.json({
            success: false,
            message: err
        }).status(500);
    }

}