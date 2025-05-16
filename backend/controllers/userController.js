const userModel = require('../models/userModel');
const validator = require('validator');

module.exports.registerUser = async (req, res) =>
{
    const { username, email, password } = req.body;
    const errors = [];

    if(!username || username.trim().length < 3)
    {
        errors.push('Username must be at least 3 characters long.');
    }

    if(!email || !validator.isEmail(email))
    {
        errors.push('Invalid email.');
    }

    const isStrongPassword = validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    });

    if(!password || !isStrongPassword)
    {
        errors.push('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
    };

    if(errors.length > 0)
    {
        return res.json({
            success: false,
            message: errors
        }).status(400);
    }
    try
    {
        const createdUser = await userModel.create({
            userName: username,
            email: email,
            password: password
        });

        return res.json({
            success: true,
            message: 'User registered successfully.'
        }).status(200);
    } catch(error)
    {
        let errMessage;
        if(process.env.APP_ENV === 'production')
        {
            errMessage = 'Internal server error';
        }
        errMessage = error;

        return res.json({
            success: false,
            message: errMessage
        }).status(500);
    }
}