const jwt = require('jsonwebtoken');

module.exports.checkAuth = async (req, res, next) =>
{
    const token = req.cookies?.token;
    console.log(token);
}