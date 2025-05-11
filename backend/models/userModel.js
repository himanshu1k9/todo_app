const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'user name field is required'],
        unique: [true, 'provided username already exists'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'email field is required.'],
        unique: [true, 'provided email already exists.'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'password field is required.'],
        minlength: [6, 'password should be minimum 6 charaters long.'],
        maxlength: [8, 'password length should not more than 8 characters.'],
        match: [
             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        ],
    }
},
    { timestamps: true }
);

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next;
    try
    {
        const saltRound = 10;
        const generatedSalt = await bcrypt.genSalt(saltRound);
        this.password = await bcrypt.hash(this.password, generatedSalt);
        next();
    } catch(error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;