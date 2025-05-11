const mongoose = require('mongoose');

module.exports.connectDB = async () =>
{
    let db;
    try
    {
        db = await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);
    } catch(error)
    {
        console.log(`DB connecton error :: ${error}`);
    }
    if(db)
    {
        console.log(`Server is successfully connected with :: Mongo DB`);
    }
}