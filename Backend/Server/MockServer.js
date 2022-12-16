const bcrypt = require('bcrypt')
const express = require('express')
const cors = require('cors')
const mssql = require('./MSSQL Configuration/MSSQL-Configuration.js')
const { validateUsername, validatePassword, validateEmail } = require('./Validations.js')
const  { CheckIfUserAlreadyCreatedEvent, HostEvent, DeleteEvent, AttendEvent, GetAllEvents, EditEvent, getEventById, DoesUserAttendEvent, GetAllUpcomingEvents, GetAllEventsHostedByUser, GetAllAttendedUserEvents, GetAllUpcomingUserEvents } = require('./Services/EventsService/EventsService.js')
const  { registerUser, GetUserEvents, UserExistsByEmail, LoginUser, FollowUser, validateToken, GetUserFollowers, DeleteProfile, GetUserAttendedEvents, AddUserBio, UserExistsById, ChangeProfilePicture, GetUserProfilePicture, CheckIfConversationExists, CreateConversation, SendMessage, GetConversationMessages } = require('./Services/UserService/UserService.js')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const port = process.env.REACT_APP_SERVER_PORT
const fs = require('fs')
const path = require('path')

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,
};

const upload = multer({ dest: 'uploads/' })

app = express()
app.use(express.json())
app.use(cors(corsOptions))

app.use(session({
    secret: process.env.REACT_APP_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: false,
        secure: false,
        expires: new Date(Date.now() + 3600000),
        httpOnly: false,
        path: '/'
        },
  }));


let start = async() =>
{
    let connection = await mssql.connectWithMSSQLDatabase()

    app.post('/login', async (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        if( req.session.user == null )
        {
            let result = await LoginUser(email, password)
            const token = jwt.sign(result.targetUserID, process.env.REACT_APP_SECRET)
            req.session.userToken = token  
            req.session.save(() => {})
            res.status(result.status).send(result.msg)
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
        // TODO FIGURE LOCATION OUT
        console.log(req.body)
        let eventName = req.body.name;
        let eventDescription = req.body.description;
        // let eventLocation = req.body.location;
        let eventLocation = 'SampleLocation';
        let eventType = req.body.type == 'Public' ? 1 : 0 ;
        let eventCategory = req.body.category;
        let eventStartDate = new Date(req.body.startDate).toISOString();
        let eventEndDate =  new Date(req.body.endDate).toISOString();
        let EventHoster = validateToken(req.session.userToken);
        let SameUserEventsAmount = await CheckIfUserAlreadyCreatedEvent(EventHoster.userID, eventName, eventStartDate, eventEndDate)
        
        try
        {
            if(SameUserEventsAmount > 1)
            {
                res.status(409).send('You have already created such an event.')
            }
            else
            {
                await HostEvent(EventHoster.userID, eventName, eventDescription, eventLocation, eventCategory, eventType, eventStartDate, eventEndDate)
                res.status(200).send('Event successfully created.')
            }
        }
        catch(err)
        {
            console.log(err)
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
        let userToken = req.session.userToken;
        let eventID = Number(JSON.parse(JSON.stringify(req.params)).eventId)
        let isTokenValid = validateToken(userToken)
        console.log(req.session)
        if(isTokenValid.status == true)
        {
            let result = await AttendEvent(isTokenValid.userID, eventID)
            res.status(result.status).send(result.msg)
        }
        else{
            res.status(409).send('You can not do that.')
        }
    })

    app.post('/doesUserAttendEvent/:eventId', async (req,res) => {
        let userToken = req.session.userToken;
        let eventID = Number(JSON.parse(JSON.stringify(req.params)).eventId)
        let isTokenValid = validateToken(userToken)
        console.log(req.session)
        if(isTokenValid.status == true)
        {
            let result = await DoesUserAttendEvent(isTokenValid.userID, eventID)
            res.status(200).send(result)
        }
        else{
            res.status(409).send('You can not do that.')
        }
    })


    app.get('/logout', (req,res) => {
        if(req.session != undefined)
        {
            delete req.session.userToken
            res.status(200).send('Log out successfull.')
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
    app.get('/GetUserEvents', async (req, res) => {
        const userToken = req.session.userToken;
        const userID = Number(jwt.decode(userToken))
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

    app.get('/getUserData', async(req,res) => {
        try{
            const userToken = req.session.userToken;
            const ID = Number(jwt.decode(userToken))
            let targetUser = await UserExistsById(ID)
            res.status(200).send(targetUser.recordset)
        }
        catch(err)
        {
            res.status(500).send('Internal server error')
        }
    })

    app.get('/getAllEvents', async(req,res) => {
        try{
            let result = await GetAllEvents()
            res.status(200).send(result)
        }
        catch(err)
        {
            res.status(500).send('Internal server error')
        }
    })
    
    app.post('/getUserDataById/:id', async(req,res) => {
        let result = await UserExistsById(Number(req.params.id))
        let userFollowers = await GetUserFollowers(Number(req.params.id))
        console.log(userFollowers)
        let targetUserProfilePictureResponse = await GetUserProfilePicture(req.params.id)
        // TODO ADD CHECK IF PROFILE PICTURE FOR GIVEN USER EXISTS OR NOT
        if(targetUserProfilePictureResponse.data != undefined)
        {
            let targetUserPfp = targetUserProfilePictureResponse.data.recordset[0].ProfilePicture
            let userObject = {
                Username: result.recordset[0].Username,
                Followers: userFollowers.followers,
                Bio: result.recordset[0].bio,
                ProfilePicture: targetUserPfp
            }
            res.status(200).send(userObject)
        }
        else
        {
            let userObject = {
                Username: result.recordset[0].Username,
                Followers: userFollowers.Followers,
                Bio: result.recordset[0].bio,
                ProfilePicture: `https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images`
            }
            res.status(200).send(userObject)
        }
        
    })

    app.get('/getEventById/:id', async(req,res) => {
        // TODO: CHECKS !
        let result = await getEventById(req.params.id)
        res.status(200).send(result[0])
    })

    app.post('/changePfp', upload.single('pfp'), async(req,res) => {
        // TODO: CHANGE PFP OPTION WILL BE AVAILABLE TO PROFILE OWNERS ONLY
        try{
            
            let userData = validateToken(req.session.userToken);
            let pfp = {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            }
            let result = await ChangeProfilePicture(userData.userID, pfp)
            res.status(result.status).send(result.msg)
            console.log(result)
        }
        catch(err){
            res.status(500).send('Internal server error.')
        }
    })

    app.get('/GetAllUpcomingEvents', async(req,res) => {
        try{
            let result = await GetAllUpcomingEvents()
            res.status(200).send(result.data.recordset)
        }
        catch(err)
        {
            res.status(500).send('Internal server error.')
        }
    })

    app.get('/GetAllEventsHostedByUser/:id', async(req,res) => {
        try{
            let result = await GetAllEventsHostedByUser(Number(req.params.id))
            res.status(200).send(result.data.recordset)
        }
        catch(err)
        {
            console.log(err)
            res.status(500).send('Internal server error.')
        }
    })

    app.get('/GetAllAttendedUserEvents/:id', async(req,res) => {
        try{
            let result = await GetAllAttendedUserEvents(Number(req.params.id))
            res.status(200).send(result.data.recordset)
        }
        catch(err)
        {
            res.status(500).send('Internal server error.')
        }
    })

    app.get('/GetAllUpcomingUserEvents/:id', async(req,res) => {
        try{
            let result = await GetAllUpcomingUserEvents(Number(req.params.id))
            console.log(result)
            res.status(200).send(result.data.recordset)
        }
        catch(err)
        {
            res.status(500).send('Internal server error.')
        }
    })

    app.post('/sendMessage/:receiverID', async(req,res) => {
        let senderToken = req.session.userToken
        let senderID = validateToken(senderToken).userID
        let receiverID = Number(req.params.receiverID)
        let message = req.body.message
        try{
            let conversationsExists = await CheckIfConversationExists(senderID, receiverID)
            if(conversationsExists.convoExists == true)
            {
                // save message to this convo
                let newMessage = await SendMessage(conversationsExists.data[0].ConvoID,message,senderID)
                res.status(200).send(newMessage.msg)
            }
            else
            {
                let newConvo = await CreateConversation(senderID, receiverID)
                // save message to convo after creating convo
                let convoID = newConvo.data.data[0].ConvoID
                let newMessage = await SendMessage(convoID,message,senderID)
                res.status(200).send(newConvo.msg)
            }
        }
        catch(err)
        {
            return {status: 500, msg: 'Internal server error', error: err}
        }

    })

    app.get('/getConversationMessages/:receiverID', async(req,res) => {
        let senderToken = req.session.userToken
        let senderID = validateToken(senderToken).userID
        let receiverID = Number(req.params.receiverID)
        let targetConvo = await CheckIfConversationExists(senderID, receiverID)
        
        let convoID = targetConvo.data[0].ConvoID
        try{
            let conversationMessages = await GetConversationMessages(convoID)
            res.status(200).send({data: conversationMessages})
        }
        catch(err)
        {
            res.status(500).send({error: err})
        }
        
    })
    app.listen(port, () => {
        console.log(`Local server running on port: ${port}`)
    })
}

start()