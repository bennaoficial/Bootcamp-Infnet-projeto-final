import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
require('dotenv').config()
 
const { SQL_DB_USER, SQL_DB_PASS, SQL_DB_HOST, SQL_DB_PORT, SQL_DB_NAME, NOSQL_DB_USER, NOSQL_DB_PASS, NOSQL_DB_HOST, NOSQL_DB_PORT, NOSQL_DB_NAME } = process.env;

// mongodb+srv://joaobenaion:<password>@cluster0.pybik9g.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://joaobenaion:<password>@cluster0.pybik9g.mongodb.net/test
//`mongodb+srv://${NOSQL_DB_USER}:<${NOSQL_DB_PASS}>@${NOSQL_DB_HOST}:${NOSQL_DB_PORT}/${NOSQL_DB_NAME}/?retryWrites=true&w=majority`
// mongoose.connect(`mongodb://${NOSQL_DB_HOST}:${NOSQL_DB_PORT}/${NOSQL_DB_NAME}`)
mongoose.connect(`mongodb+srv://${NOSQL_DB_USER}:${NOSQL_DB_PASS}@${NOSQL_DB_HOST}/?retryWrites=true&w=majority`)
const mongooseDb = mongoose.connection;

const sequelizeDb = new Sequelize(`mysql://${SQL_DB_USER}:${SQL_DB_PASS}@${SQL_DB_HOST}:${SQL_DB_PORT}/${SQL_DB_NAME}`,{
    dialect: 'mysql'
});


export {
    sequelizeDb,
    mongooseDb

}
