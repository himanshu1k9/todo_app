const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userROutes = require('./routes/userRoutes');

const db = require('./config/dbConnect');

dotenv.config();

const todoApp = express();

todoApp.use(cors());


const port = process.env.APP_PORT || 8000;
todoApp.use(express.urlencoded({ extended: true }));
todoApp.use(express.json());
todoApp.use('/todo', userROutes);


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