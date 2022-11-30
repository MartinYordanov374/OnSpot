const bcrypt = require('bcrypt')
const express = require('express')
const cors = require('cors')
const mssql_configuration = require('./MSSQL Configuration/MSSQL-Configuration.js')
const { validateUsername, validatePassword, validateEmail } = require('./Validations.js')
const  { CheckIfUserAlreadyCreatedEvent, HostEvent, DeleteEvent, AttendEvent, GetAllEvents } = require('./Services/EventsService/EventsService.js')
const  { registerUser, UserExists } = require('./Services/UserService/UserService.js')
const port = process.env.REACT_APP_SERVER_PORT

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
    let SameUserEventsAmount = await CheckIfUserAlreadyCreatedEvent(EventHosterID, eventName, eventDate)
    
    try
    {
        if(SameUserEventsAmount > 1)
        {
            res.status(409).send('You have already created such an event.')
        }
        else
        {
            await HostEvent(EventHosterID, eventName, eventDescription, eventLocation, eventCategory, eventType, eventDate)
            res.status(200).send('Event successfully created.')
        }
    }
    catch(err)
    {
        res.status(500).send('Internal server error.')
    }
    
})

app.delete('/deleteEvent/:userID/:eventId', async(req,res) => {
    let eventID = Number(JSON.parse(JSON.stringify(req.params)).eventId)
    let EventHosterID = Number(JSON.parse(JSON.stringify(req.params)).userID)

    let result = await DeleteEvent(eventID, EventHosterID)
    res.status(result.status).send(result.msg)

})

app.post('/attendEvent/:eventId', async (req,res) => {
    let userID = req.body.userID;
    let eventID = Number(JSON.parse(JSON.stringify(req.params)).eventId)

    let result = await AttendEvent(userID, eventID)
    res.status(result.status).send(result.msg)
})

app.get('/GetAllEvents', async (req,res) => {
    let result = await GetAllEvents()
    res.status(result.status).send(result.payload)
})

app.listen(port, () => {
    console.log(`Local server running on port: ${port}`)
})
