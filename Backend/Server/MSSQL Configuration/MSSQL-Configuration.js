const sql = require('mssql')
require('dotenv').config()
// you should be able to get the following data from your connection string
let connectionStringData = {
    server: process.env.REACT_APP_SERVER_ADDRESS,
    database: process.env.REACT_APP_SERVER_DATABASENAME,
    user: process.env.REACT_APP_SERVER_USER,
    password: process.env.REACT_APP_SERVER_PASSWORD,
    options: {"trustServerCertificate": true}
}
async function connectWithMSSQLDatabase() {
    try{
        sql.connect(connectionStringData)
        console.log('successfully connected with the database')
    }
    catch(err)
    {
        console.log(err)
    }
}
connectWithMSSQLDatabase()
