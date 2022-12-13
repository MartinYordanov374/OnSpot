const sql = require('mssql')
require('dotenv').config()
const queries = require('../utils/utils')

let connectionStringData = {
    server: process.env.REACT_APP_SERVER_ADDRESS,
    database: process.env.REACT_APP_SERVER_DATABASENAME,
    user: process.env.REACT_APP_SERVER_USER,
    password: process.env.REACT_APP_SERVER_PASSWORD,
    options: {"trustServerCertificate": true}
}

async function connectWithMSSQLDatabase() {
    try{
        let conn = await sql.connect(connectionStringData)
        console.log('successfully connected with the database')
        await sql.query(queries.CREATE_ATTENDANCES_TABLE_QUERY)
        await sql.query(queries.CREATE_EVENT_KEYWORDS_TABLE_QUERY)
        await sql.query(queries.CREATE_EVENT_TABLE_QUERY_QUERY)
        await sql.query(queries.CREATE_KEYWORDS_TABLE_QUERY)
        await sql.query(queries.CREATE_FOLLOWERS_TABLE_QUERY)
        await sql.query(queries.CREATE_PROFILE_PICTURES_TABLE_QUERY)
        await sql.query(queries.CREATE_USERS_TABLE_QUERY)
        return conn
    }
    catch(err)
    {
        console.log(err)
    }
}

module.exports = {connectWithMSSQLDatabase}