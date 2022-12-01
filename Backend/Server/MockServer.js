const bcrypt = require('bcrypt')
const express = require('express')
const cors = require('cors')
const mssql = require('./MSSQL Configuration/MSSQL-Configuration.js')
const { validateUsername, validatePassword, validateEmail } = require('./Validations.js')
const  { CheckIfUserAlreadyCreatedEvent, HostEvent, DeleteEvent, AttendEvent, GetAllEvents, EditEvent } = require('./Services/EventsService/EventsService.js')
const  { registerUser, GetUserEvents, UserExistsByEmail, LoginUser, FollowUser, validateToken, GetUserFollowers, DeleteProfile, GetUserAttendedEvents, AddUserBio } = require('./Services/UserService/UserService.js')
const session = require('express-session')
const jwt = require('jsonwebtoken')

const port = process.env.REACT_APP_SERVER_PORT

app = express()
app.use(express.json())
app.use(cors())

app.use(session({
    secret: process.env.REACT_APP_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: false,
        secure: false,
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
        path: '/'
        },
  }));
let start = async() =>
{
    let connection = await mssql.connectWithMSSQLDatabase()
    
    app.get('/', (req,res) => {
        res.status(200).send('Home page reached successfully')
    })

    app.post('/login', async (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        if( req.session.user == null )
        {
            
            let result = await LoginUser(email, password)
            if(result.targetUserID != undefined)
            {
                const token = jwt.sign(result.targetUserID, process.env.REACT_APP_SECRET)
                req.session.userToken = token  
                req.session.save(() => {})
                res.status(result.status).send(result.msg)
            }
            else
            {
                res.status(result.status).send(result.msg)
            }
        }
        else
        {
            res.status(409).send('You are already logged in')
        }
        
    })

    app.post('/register', async (req,res) => {

        try{
            let username = req.body.username;
            let password = req.body.password;
            let email = req.body.email.toLowerCase();

            if(validateUsername(username).status && validatePassword(password).status && validateEmail(email).status)
            {
                let targetUser = await (await UserExistsByEmail(email)).recordset
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

                else if(validatePassword(password).status == false)
                {
                    res.status(401).send(validatePassword(password).msg)
                }

                else if(validateEmail(email).status == false)
                {
                    res.status(401).send(validateEmail(email).msg)
                }
            }
        }
        catch(err)
        {
            res.status(500).send('Internal server error.')
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

    app.get('/logout', (req,res) => {
        console.log( req.session.userToken)
        if(req.session)
        {
            req.session.destroy()
            res.clearCookie('connect.sid', {path: '/'})
            res.status(200).send({status: 200, msg: 'logging out'})
        }
        
    })

    app.get('/getUserFollowers/:id', async (req,res) => {
        let targetUser = Number(req.params.id)
        let result = await GetUserFollowers(targetUser) 
        try{
            res.status(result.status).send(result.followers.toString())
        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.post('/followUser/:userToBeFollowedId', async(req,res) => {
        let userToBeFollowedId = Number(req.params.userToBeFollowedId)
        let followerToken = req.session.userToken
        let isTokenValid = validateToken(followerToken)
        if( isTokenValid.status == true )
        {
           let result =  await FollowUser( Number(isTokenValid.userID), userToBeFollowedId)
           res.status(result.status).send(result.msg)
        }
        else
        {
            res.status(409).send('You cannot do this action!')
        }
    })

    app.delete('/deleteProfile/:id', async (req,res) => {
        let profileID = Number(req.params.id)
        let CurrentUserToken = req.session.userToken
        let result = await DeleteProfile(CurrentUserToken, profileID)
        res.status(result.status).send(result.msg)

    })
    app.get('/GetUserEvents/:userID', async (req, res) => {
        let userID = Number(req.params.userID)
        let result = await GetUserEvents(userID)

        if(result.status != 404)
        {
            res.status(result.status).send(result.userEvents)
        }
        else
        {
            res.status(result.status).send(result.msg)
        }
    })

    app.get('/GetUserAttendedEvents/:userID', async(req,res) => {
        let userID = Number(req.params.userID)
        let result = await GetUserAttendedEvents(userID)

        if(result.status != 404)
        {
            res.status(result.status).send(result.userEvents)
        }
        else
        {
            res.status(result.status).send(result.msg)
        }
    })
    
    app.post('/AddUserBio/:profileID', async(req,res) => {
        let profileID = Number(req.params.profileID)
        let userToken = req.session.userToken
        let updatedBio = req.body.bio;
        if(updatedBio.length > 120)
        {
            updatedBio = updatedBio.slice(0, 120)
        }
        let result = await AddUserBio(userToken, profileID, updatedBio)
        res.status(result.status).send(result.msg)
    })

    app.post('/EditEvent/:eventID', async(req,res) => {
        let updatedEventName = req.body.updatedEventName
        let updatedEventDesc = req.body.updatedEventDesc;
        let updatedEventDate = new Date(req.body.updatedEventDate).toISOString()
        let updatedEventType = req.body.updatedEventType;
        let updatedEventCategory = req.body.updatedEventCategory;

        let targetEventID = Number(req.params.eventID)
        let currentUserToken = req.params.userToken;

        let result = await EditEvent(targetEventID, currentUserToken, updatedEventName, updatedEventCategory, updatedEventDate, updatedEventDesc, updatedEventType )
        res.status(result.status).send(result.msg)

    })

    app.get('/isUserLoggedIn', (req,res) => {
        if(req.session.userToken)
        {
            res.send(true)
        }
        else
        {
            res.send(false)
        }

    })


    app.listen(port, () => {
        console.log(`Local server running on port: ${port}`)
    })
}

start()