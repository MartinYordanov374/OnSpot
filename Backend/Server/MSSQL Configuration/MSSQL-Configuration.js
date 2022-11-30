const sql = require('mssql')
require('dotenv').config()
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
        return conn
    }
    catch(err)
    {
        console.log(err)
    }
}

module.exports = {connectWithMSSQLDatabase}