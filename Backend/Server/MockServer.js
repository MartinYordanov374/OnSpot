const bcrypt = require('bcrypt')
let express = require('express')
let cors = require('cors')

let sql = require('mssql')
let mssql_configuration = require('./MSSQL Configuration/MSSQL-Configuration.js')

const { validateUsername, validatePassword } = require('./Validations.js')
//#region Variables
let port = process.env.REACT_APP_SERVER_PORT
let saltRounds = process.env.REACT_APP_SALT_ROUNDS
//#endregion

app = express()
app.use(express.json())
app.use(cors())



app.get('/', (req,res) => {
    
    res.status(200).send('Home page reached successfully')
})

app.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    // change those checks as you need
    if(username.length <= 3 || password.length <= 3)
    {
        res.status(401).send('Log In failed. Invalid credentials.')
    }
    else{
        let targetUser = await (await UserExists(username)).recordset
        if(targetUser.length > 0)
        {
            if(await bcrypt.compare(password, targetUser[0].hashedPass))
            {
                res.status(200).send('User logged in successfully') 
            }
            else{
                res.status(401).send('Wrong password.')
            }
        }
        else
        {
            res.status(404).send('This user does not exist.')
        }
    }
})

app.post('/register', async (req,res) => {


    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    if(validateUsername(username).status && validatePassword(password).status)
    {
        let targetUser = await (await UserExists(username)).recordset
        if(targetUser.length > 0)
        {
            res.status(409).send('This user already exists!') 
        }
        else
        {
            await registerUser(username, password, email)
            res.status(200).send('User successfully registered') 
        }
    }
    else
    {
        if(validateUsername(username).status == false)
        {
            res.status(401).send(validateUsername(username).msg)
        }
        res.status(200).send(validateUsername(username).msg)

        if(validatePassword(password).status == false)
        {
            res.status(401).send(validatePassword(password).msg)
        }
        res.status(200).send(validatePassword(password).msg)
    }
})

app.listen(port, () => {
    console.log(`Local server running on port: ${port}`)
})


//#region Functions

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
//#endregion
