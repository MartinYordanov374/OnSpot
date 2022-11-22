const sql = require('mssql')

// you should be able to get the following data from your connection string
let connectionStringData = {
    server: 'your server address',
    database: 'your target database',
    user: 'your connection string user (usually sa)',
    password: 'your connection string password',
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
