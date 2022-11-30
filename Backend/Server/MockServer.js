const bcrypt = require('bcrypt')
let express = require('express')
let cors = require('cors')

let sql = require('mssql')
let mssql_configuration = require('./MSSQL Configuration/MSSQL-Configuration.js')

const { validateUsername, validatePassword, validateEmail } = require('./Validations.js')
//#region Variables
let port = process.env.REACT_APP_SERVER_PORT
let saltRounds = Number(process.env.REACT_APP_SALT_ROUNDS)
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
    // TODO GENERATE JWT TOKEN UPON LOGIN, SO THAT YOU CAN KEEP THE USER SESSION

    let targetUser = await (await UserExists(username)).recordset
    if(targetUser.length > 0)
    {
        if(await bcrypt.compare(password, targetUser[0].HashedPassword))
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
    
})

app.post('/register', async (req,res) => {


    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email.toLowerCase();

    if(validateUsername(username).status && validatePassword(password).status && validateEmail(email).status)
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

        if(validatePassword(password).status == false)
        {
            res.status(401).send(validatePassword(password).msg)
        }

        if(validateEmail(email).status == false)
        {
            res.status(401).send(validateEmail(email).msg)
        }
    }
})

app.post('/hostEvent', async (req,res) => {
    // TODO FIGURE LOCATION OUT + user ID
    // TODO ADD CHECK IF USER ALREADY CREATED SUCH AN EVENT
    let eventName = req.body.name;
    let eventDescription = req.body.description;
    let eventLocation = req.body.location;
    let eventType = req.body.type == 'Public' ? 1 : 0 ;
    let eventCategory = req.body.category;
    let eventDate = new Date(req.body.date).toISOString();
    let EventHosterID = 1;
    let result = await HostEvent(EventHosterID, eventName, eventDescription, eventLocation, eventCategory, eventType, eventDate)
})
/* TODO:
    -- create(host) event endpoint
    -- delete event endpoint
    -- attend event endpoint (un-attend if already attending)
    -- edit event, if user is owner of event
    -- follow user endpoint (unfollow if already followed)
    -- get events endpoint
    -- search events by keyword endpoint (will probably use cosine similarity)
    -- recommend event by user interests using the already gathered data and the KNN implemented earlier
    -- add profile picture endpoint
    -- add background picture endpoint
    -- add bio endpoint
    -- edit bio endpoint
    -- logout endpoint
    -- delete profile endpoint
    -- get hosted events endpoint
    -- get attended events endpoint
    -- get upcoming events endpoint
    -- see followers endpoint
    -- upload event images endpoint
    -- add event comments endpoint

    ------ CHAT SYSTEM ------
    -- receive message endpoint
    -- send message endpoint
    -- refresh chat endpoint
*/

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

async function HostEvent(EventHosterID, EventName, EventDescription, location, EventClass, EventType, EventDate)
{
    let result = await sql.query`
    INSERT INTO dbo.Events(EventHosterID, EventName, EventDescription, EventClass, EventType, EventDate) 
    VALUES(${EventHosterID}, ${EventName}, ${EventDescription}, ${EventClass}, ${EventType}, ${EventDate})`

    return result
}
//#endregion
