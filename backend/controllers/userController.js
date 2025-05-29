const userModel = require('../models/userModel');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
            message: 'User registered successfully.',
            createdUser
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

module.exports.loginUser = async (req, res) =>
{
    const { email, password } = req.body;
    if(!email || !password)
    {
        return res.json({
            success: false,
            message: 'Either email or password is missing.'
        }).status(400);
    }

    const existingUser = await userModel.findOne({email: email});
    if(existingUser)
    {
        const isMatched = await bcrypt.compare(password, existingUser.password);
        if(isMatched)
        {
            const token = await jwt.sign({user: existingUser}, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
            if(token)
            {
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    maxAge: 1 * 60 * 60 * 1000,
                    path: '/',
                });
                return res.json({
                    token: token,
                    success: true,
                    message: 'User logged in successfully.',
                    user:existingUser
                }).status(200);
            } else {
                return res.json({
                    success: false,
                    message: 'An error occured while generating the token.'
                }).status(500);
            }
        } else {
            return res.json({
                success: false,
                message: 'Invalid email or password.'
            }).status(400);
        }
    } else {
        return res.json({
            success: false,
            message: 'User not found'
        }).status(400);
    }
}

module.exports.checkIsAuthenticated = async (req, res) => 
{
    const token = req.cookies.token;
    if(!token)
    {
        return res.json({isAuthenticated: false}).status(400);
    }
    try
    {
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        return res.json({
            isAuthenticated: true,
            user: decodedToken.user
        }).status(200);
    } catch(err)
    {
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


module.exports.handleLogout = async (req, res) => 
{
   await res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        path: '/',
    });

    return res.json({
        success:true,
        message: 'User LoggedOut successfully.'
    }).status(200);
}