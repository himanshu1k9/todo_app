const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userROutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoROutes');
const cookieParser = require('cookie-parser');

const db = require('./config/dbConnect');

dotenv.config();

const todoApp = express();

todoApp.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

const port = process.env.APP_PORT || 8000;
todoApp.use(express.urlencoded({ extended: true }));
todoApp.use(express.json());
todoApp.use(cookieParser());
todoApp.use('/todo', userROutes);
todoApp.use('/todo', todoRoutes);


module.exports.startServer = async () =>
{
    await db.connectDB();
    let server;
    try
    {
        server = await todoApp.listen(port);
    } catch(error) {
        console.log(`Server starting error :: ${error}`);
    }

    if(server)
    {
        console.log(`Server is up and rumimg on port :: ${port}`);
    }
};