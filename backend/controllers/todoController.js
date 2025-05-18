const todoModel = require('../models/todoModel');
const validatr = require('validator');

module.exports.createTodo = async (req, res) =>
{
    const { title, date, time } = req.body;
    const userId = req.user._id;
    const errors = [];
    if(!title)
    {
        errors.push('Title field is required.')
    }

    if(!date || !validatr.isDate(date))
    {
        errors.push('invalid date format.')
    }

    if(!time || !validatr.isTime(time))
    {
        errors.push('Invalid time format.')
    };

    if(!userId)
    {
        errors.push('user id is required');
    }

    if(errors.length > 0)
    {
        return res.json({
            success: false,
            message: errors
        }).status(400);
    }

    try 
    {
        const createdTodo = await todoModel.create({
            user: userId,
            title: title,
            date: date,
            time: time
        });

        return res.status(200).json({
            success: true,
            message: 'Todo created successfully.',
            tosk: createdTodo
        });
    } catch(error) {
        let errMsg;
        if(process.env.APP_ENV == 'production')
        {
            errMsg = 'Internal server error.'
        }
        errMsg = error.message;
        return res.json({
            success: false,
            message: errMsg
        }).status(500);
    }
    
}

module.exports.getTodos = async (req, res) =>
{
    const user = req.user;
    const userId = user?._id;

    if(userId)
    {
        const todos = await todoModel.find({ user: userId });
        if(todos)
        {
            return res.json({
                success: true,
                message: 'list of all todos',
                data: todos
            }).status(200);
        } else {
            return res.json({
                success: false,
                message: 'No todos found.'
            }).status(400)
        }
    } else {
        return res.json({
            success: false,
            message: 'No user found or unauthorized access.'
        }).status(400);
    }
}

module.exports.getSingleTodo = async (req, res) =>
{
    const user = req.user;
    const userId = user?._id;
    const todoId = req.params.id;

    if(!userId || !todoId)
    {
        return res.json({
            success: false,
            message: 'Nouser found or unauthorized access.'
        }).status(400);
    }

    try
    {
        const todo = await todoModel.findById({ _id: todoId });
        return res.json({
            success: true,
            message: 'finded todo',
            data: todo
        }).status(200);
    } catch(error)
    {
        let errMsg;
        if(process.env.APP_ENV == 'production')
        {
            errMsg = 'Internal server error.';
        }
        errMsg = error.message;
        return res.json({
            success: false,
            message: errMsg
        }).status(500);
    }
}

module.exports.updateTodo = async (req, res) =>
{
    const { title, date, time, isCompleted } = req.body;
    const todoId = req.params.id;

    if(date && !validatr.isDate(date))
    {
        errors.push('invalid date format.')
    }

    if(time && !validatr.isTime(time))
    {
        errors.push('Invalid time format.')
    };

    if(todoId)
    {
        try
        {
             const upadtedTodo = await todoModel.findByIdAndUpdate({
                    _id: todoId,
                    user: req.user._id
            }, {
                title: title,
                date: date,
                time: time,
                isCompleted: isCompleted
            }, { new: true });

            return res.json({
                success: true,
                message: 'Todo updated successfully.',
                data: upadtedTodo
            }).status(200);
        } catch(error)
        {
             let errMsg;
            if(process.env.APP_ENV == 'production')
            {
                errMsg = 'Internal server error.';
            }
            errMsg = error.message;
            return res.json({
                success: false,
                message: errMsg
            }).status(500);
        }
    } else {
         return res.json({
            success: false,
            message: 'undefined todo id.'
        }).status(400);
    }
}

module.exports.deleteTodo = async (req, res) =>
{
    const todoId = req.params.id;
    const userId = req.user?._id;

    if(!todoId || !userId)
    {
        return res.json({
            success: false,
            message: 'invalid id.'
        }).status(400);
    }

    try {
        const deletedTodo = await todoModel.findByIdAndDelete({_id: todoId, user: userId});
        return res.json({
            success: true,
            message: 'todo deleted successfully.',
            data: deletedTodo
        }).status(200);
    } catch(error)
    {
         let errMsg;
        if(process.env.APP_ENV == 'production')
        {
            errMsg = 'Internal server error.';
        }
        errMsg = error.message;
        return res.json({
            success: false,
            message: errMsg
        }).status(500);
    }
}