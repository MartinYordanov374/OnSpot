const bcrypt = require('bcrypt')
const sql = require('mssql')
const saltRounds = Number(process.env.REACT_APP_SALT_ROUNDS)

async function registerUser(username, password, email)
{
    let hashedPass = await bcrypt.hash(password, saltRounds)
    await sql.query`INSERT INTO dbo.USERS(Username, Email, HashedPassword) VALUES(${username}, ${email}, ${hashedPass})`
    
}

async function UserExists(username)
{
    let result = await sql.query`SELECT * FROM dbo.users WHERE username = ${username}`
    return result
}

module.exports = {
    registerUser,
    UserExists
}