const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const db = require('./config/dbConnect');

dotenv.config();

const todoApp = express();

todoApp.use(cors());


const port = process.env.APP_PORT || 8000;


module.exports.startServer = async () =>
{
    let bdConnection = await db.connectDB();

    if(bdConnection)
    {
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
    }
};