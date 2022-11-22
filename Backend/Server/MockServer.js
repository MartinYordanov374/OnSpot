const bcrypt = require('bcrypt')
let express = require('express')
let cors = require('cors')

let sql = require('mssql')
let mssql_configuration = require('./MSSQL Configuration/MSSQL-Configuration.js')

//#region Variables
let port = 3300
let saltRounds = 9
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
    // change those checks as you need
    if(username.length <= 3 || password.length <= 3)
    {
      res.status(401).send('Registration failed. Invalid credentials.')
    }
    else
    {
        let targetUser = await (await UserExists(username)).recordset
        if(targetUser.length > 0)
        {
            res.status(409).send('This user already exists!') 
        }
        else
        {
            await registerUser(username, password)
            res.status(200).send('User successfully registered') 
        }
    }
})

app.listen(port, () => {
    console.log(`Local server running on port: ${port}`)
})


//#region Functions

async function registerUser(username, password)
{
    let hashedPass = await bcrypt.hash(password, saltRounds)
    await sql.query`INSERT INTO dbo.USERS VALUES(${username}, ${hashedPass})`
    
}

async function UserExists(username)
{
    let result = await sql.query`SELECT * FROM dbo.users WHERE username = ${username}`
    return result
}
//#endregion
