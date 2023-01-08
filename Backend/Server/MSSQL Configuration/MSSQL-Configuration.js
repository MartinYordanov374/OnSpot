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
        Object.values(queries).forEach( async (query, index) => {
            try{
                await sql.query(query)
            }
            catch(err)
            {
                console.log(err.message)
            }
        })

        return conn
    }
    catch(err)
    {
        console.log(err)
    }
}

module.exports = {connectWithMSSQLDatabase}