const bcrypt = require('bcrypt')
const express = require('express')
const cors = require('cors')
const mssql = require('./MSSQL Configuration/MSSQL-Configuration.js')
const { validateUsername, validatePassword, validateEmail } = require('./Validations.js')
const  { CheckIfUserAlreadyCreatedEvent, HostEvent, DeleteEvent, AttendEvent, GetAllEvents, EditEvent, getEventById, DoesUserAttendEvent, GetAllUpcomingEvents, GetAllEventsHostedByUser, GetAllAttendedUserEvents, GetAllUpcomingUserEvents, getLastTwoEvents, UploadEventImages, GetEventImages, UploadPostImages, GetAllSearchedEvents } = require('./Services/EventsService/EventsService.js')
const  { registerUser, GetUserEvents, UserExistsByEmail, LoginUser, FollowUser, validateToken, GetUserFollowers, DeleteProfile, GetUserAttendedEvents, AddUserBio, UserExistsById, ChangeProfilePicture, GetUserProfilePicture, CheckIfConversationExists, CreateConversation, SendMessage, GetConversationMessages, ChangeBackgroundPicture, GetUserBackgroundPicture, updateUsername, updateEmail, updateBio, BlockUser, UnblockUser, GetBlockedUsers, GetUserPosts, GetPostComments, CreatePost, DeletePost, UpdatePost, GetTotalPostLikes, GetPostLikers, LikePost, GetPostShares, SharePost, GetUserSharedPosts, DeleteSharedPost, SaveUserPreference, GetUserPreferences, SaveUserLatestPreference, GetPostImages, SaveNotification, GetUserNotifications, MarkNotificationAsRead } = require('./Services/UserService/UserService.js')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const port = process.env.REACT_APP_SERVER_PORT
const fs = require('fs')
const path = require('path')
const Axios = require('axios')

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,
};

const upload = multer({ dest: 'uploads/' })

app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {cors: {origin: '*'}});

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
        try{
            if( req.session.user == null )
            {
                let result = await LoginUser(email, password)
                if(result.status != 404)
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
        }
        catch(err)
        {
            console.log(err)
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
        let eventName = req.body.name;
        let eventDescription = req.body.description;
        let eventLocation = req.body.location;
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
            res.status(500).send('Internal server error.')
        }
        
    })

    app.delete('/deleteEvent/:userID/:eventId', async(req,res) => {
        let eventID = Number(JSON.parse(JSON.stringify(req.params)).eventId)
        let EventHosterID = Number(JSON.parse(JSON.stringify(req.params)).userID)

        let result = await DeleteEvent(eventID, EventHosterID)
        res.status(result.status).send(result.msg)

    })

    app.delete('/deletePost/:postID', async(req,res) => {
        let postID = Number(req.params.postID)
        let result = await DeletePost(postID)
        res.status(result.status).send(result.msg)

    })

    app.post('/attendEvent/:eventId', async (req,res) => {
        let userToken = req.session.userToken;
        let eventID = Number(JSON.parse(JSON.stringify(req.params)).eventId)
        let isTokenValid = validateToken(userToken)
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
            res.status(result.status).send(result.followers)
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
        let userToken = req.session.userToken;
        let result = await DeleteProfile(userToken, profileID)
        delete req.session.userToken

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
        let updatedEventStartDate = new Date(req.body.updatedEventStartDate).toISOString()
        let updatedEventEndDate = new Date(req.body.updatedEventEndDate).toISOString()

        let updatedEventType = req.body.updatedEventType;
        let updatedEventCategory = req.body.updatedEventCategory;
        let updatedEventLocation = req.body.updatedEventLocation;

        let targetEventID = Number(req.params.eventID)
        let currentUserToken = req.session.userToken;

        let result = await EditEvent(targetEventID, currentUserToken, updatedEventName, updatedEventCategory, updatedEventStartDate, updatedEventEndDate, updatedEventDesc, updatedEventType, updatedEventLocation )
        .then((result) => {
            res.status(result.status).send(result.msg)
        })
        .catch((err) => {
            console.log(err)
        })

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
            const userToken = req.session.userToken;
            const UserID = validateToken(userToken).userID
            let result = await GetAllEvents(UserID)
            res.status(200).send(result)
        }
        catch(err)
        {
            res.status(500).send('Internal server error')
        }
    })
    
    app.post('/getUserDataById/:id', async(req,res) => {
        let profileID = Number(req.params.id)
        let result = await UserExistsById(profileID)
        let currentUserID = validateToken(req.session.userToken).userID
        let currentUserBlockList = await GetBlockedUsers(currentUserID)
        let blockedUsers = currentUserBlockList.blockedUsersList.recordset
        let isProfileBlocked = blockedUsers.find((blockedUser) => blockedUser.BlockedUserID == profileID)
        if(isProfileBlocked)
        {
            res.status(200).send({isUserBlocked: true})

        }
        else
        {
            
            let userFollowers = await GetUserFollowers(profileID)
            let userPosts = await GetUserPosts(profileID)
            let userPostImages = await GetPostImages(profileID)
            let userSharedPosts = await GetUserSharedPosts(profileID)
            let targetUserProfilePictureResponse = await GetUserProfilePicture(profileID)
            let targetUserBackgroundPictureResponse = await GetUserBackgroundPicture(profileID)
            // TODO ADD CHECK IF PROFILE PICTURE FOR GIVEN USER EXISTS OR NOT
            if(targetUserProfilePictureResponse.data != undefined)
            {
                if(targetUserBackgroundPictureResponse.data != undefined)
                {
                    let targetUserPfp = targetUserProfilePictureResponse.data.recordset[0].ProfilePicture
                    let targetUserBackgroundPicture = targetUserBackgroundPictureResponse.data.recordset[0].BackgroundPicture
                    let userObject = {
                        Username: result.recordset[0].Username,
                        Followers: userFollowers.followers,
                        Bio: result.recordset[0].bio,
                        ProfilePicture: targetUserPfp,
                        BackgroundPicture: targetUserBackgroundPicture,
                        Posts: userPosts,
                        SharedPosts: userSharedPosts,
                        PostsImages: userPostImages
                    }
                    res.status(200).send(userObject)
                }
                else
                {
                    let targetUserPfp = targetUserProfilePictureResponse.data.recordset[0].ProfilePicture
                    let userObject = {
                        Username: result.recordset[0].Username,
                        Followers: userFollowers.followers,
                        Bio: result.recordset[0].bio,
                        ProfilePicture: targetUserPfp,
                        BackgroundPicture: `https://www.wallpapers.net/web/wallpapers/night-lights-long-term-exposure-hd-wallpaper/5120x2160.jpg`,
                        Posts: userPosts,
                        SharedPosts: userSharedPosts,
                        PostsImages: userPostImages

                    }
                    res.status(200).send(userObject)
                }
            }
            else
            {
                if(targetUserBackgroundPictureResponse.data != undefined)
                {
                    let targetUserBackgroundPicture = targetUserBackgroundPictureResponse.data.recordset[0].BackgroundPicture
                    let userObject = {
                        Username: result.recordset[0].Username,
                        Followers: userFollowers.Followers,
                        Bio: result.recordset[0].bio,
                        ProfilePicture: `https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images`,
                        BackgroundPicture: targetUserBackgroundPicture,
                        Posts: userPosts,
                        SharedPosts: userSharedPosts,
                        PostsImages: userPostImages
                    }
                    res.status(200).send(userObject)
                }
                else
                {
                    let userObject = {
                        Username: result.recordset[0].Username,
                        Followers: userFollowers.Followers,
                        Bio: result.recordset[0].bio,
                        ProfilePicture: `https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2F8b%2F16%2F7a%2F8b167af653c2399dd93b952a48740620.jpg&f=1&nofb=1&ipt=33608bf0973b950d8a9032fd47b796c156c60bf3f6edf4b174dc2947f2d9b4da&ipo=images`,
                        BackgroundPicture: `https://www.wallpapers.net/web/wallpapers/night-lights-long-term-exposure-hd-wallpaper/5120x2160.jpg`,
                        Posts: userPosts,
                        SharedPosts: userSharedPosts,
                        PostsImages: userPostImages

                    }
                    res.status(200).send(userObject)
                }
            }
        }
        
    })

    app.get('/getEventById/:id', async(req,res) => {
        // TODO: CHECKS !
        let result = await getEventById(req.params.id)
        res.status(200).send(result[0])
    })

    app.get('/getNextTwoEvents/:lastEventId', async(req,res) => {
        let result = await getLastTwoEvents(req.params.lastEventId, validateToken(req.session.userToken).userID)
        res.status(200).send(result)
    })
    app.post('/changePfp', upload.single('pfp'), async(req,res) => {
        try{
            
            let userData = validateToken(req.session.userToken);
            let pfp = {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            }
            let result = await ChangeProfilePicture(userData.userID, pfp)
            res.status(result.status).send(result.msg)
        }
        catch(err){
            res.status(500).send('Internal server error.')
        }
    })

    app.post('/changeBackgroundPicture', upload.single('pfp'), async(req,res) => {
        try{
            
            let userData = validateToken(req.session.userToken);
            let pfp = {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            }
            let result = await ChangeBackgroundPicture(userData.userID, pfp)
            console.log(result.err)
            res.status(result.status).send(result.msg)
        }
        catch(err){
            console.log(err)
            res.status(500).send('Internal server error.')
        }
    })

    app.post('/addEventImages/:postID', upload.array('eventImages',4), async(req,res) => {
        try{
            let postID = Number(req.params.postID)
            let userData = validateToken(req.session.userToken)
            let eventImages = []
            for(let image of req.files)
            {
                eventImages.push(fs.readFileSync(path.join(__dirname + '/uploads/' + image.filename)))
            }
            let result = await UploadEventImages(userData.userID, postID, eventImages)
            res.status(result.status).send(result.msg)
        }
        catch(err){
            console.log(err)
            res.status(500).send('Internal server error.')
        }
    })

    app.get('/isUserEventOwner/:eventID', async(req,res) => {
        try{
            let targetEventID = req.params.eventID
            let targetEventData = await getEventById(targetEventID)
            let targetUserData = validateToken(req.session.userToken);
            let targetUserID = targetUserData.userID
            if(Number(targetUserID) == targetEventData[0].id)
            {
                res.status(200).send({message: 'User is owner of the event.', isUserOwner: true})
            }
            else
            {
                res.status(409).send({message: 'User is not owner of the event.', isUserOwner: false})
            }
        }
        catch(err)
        {
            console.log(err)
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
                res.status(200).send(newMessage.msg)
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
        io.emit('getConvo', () => {

        })

        try{
            let targetConvo = await CheckIfConversationExists(senderID, receiverID)
            let convoID = targetConvo.data[0].ConvoID
            if(convoID != undefined)
            {
                let conversationMessages = await GetConversationMessages(convoID)
                res.status(200).send({data: conversationMessages})
            }
            else
            {
                //TODO: Please add an adequate response...
                console.log('An error occured.')
            }
        }
        catch(err)
        {
            res.status(500).send({error: err})
        }
        
    })

    //TODO: add validations !
    app.post('/updateUsername/:userID', async(req,res) => {
        let newUsername = req.body.username;
        let userToken = validateToken(req.session.userToken)
        let userID = userToken.userID;
        try{
            if(userID == Number(req.params.userID))
            {
                let result = await updateUsername(userID, newUsername)
                .then((result) => {
                    res.status(200).send('Username changed successfully')
                })
            }
            else
            {
                res.status(409).send({'msg': 'You can\'t do this aciton'})
            }
        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.post('/updateEmail/:userID', async(req,res) => {
        let newEmail = req.body.email;
        let userToken = validateToken(req.session.userToken)
        let userID = userToken.userID;
        try{
            if(userID == Number(req.params.userID))
            {
                let result = await updateEmail(userID, newEmail)
                .then((result) => {
                    res.status(200).send('Email changed successfully')
                })
    
            }
            else
            {
                res.status(409).send({'msg': 'You can\'t do this aciton'})
            }
        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.post('/updateBio/:userID', async(req,res) => {
        let newBio = req.body.bio;
        let userToken = validateToken(req.session.userToken)
        let userID = userToken.userID;
        try{
            if(userID == Number(req.params.userID))
            {
                let result = await updateBio(userID, newBio)
                .then((result) => {
                    res.status(200).send('Bio changed successfully')
                })
                .catch((err) => {
                    res.status(409).send({err: err})
                })
            }
            else
            {
                res.status(409).send({'msg': 'You can\'t do this aciton'})
            }
        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.post('/blockUser/:blockedUserID', async(req,res) => {
        try{
            let currentUserToken = req.session.userToken
            let currentUserTokenValidated = await validateToken(currentUserToken)
            let currentUserID = currentUserTokenValidated.userID
            let blockedUserID = req.params.blockedUserID
            let result = await BlockUser(currentUserID, blockedUserID)
            res.status(200).send({responseData: result})
        }
        catch(err)
        {
            res.status(400).send({msg: 'Something went wrong.', err: err})
        }
        
    })

    app.post('/unblockUser/:blockedUserID', async(req,res) => {
        try{
            let currentUserToken = req.session.userToken
            let currentUserID = await validateToken(currentUserToken).userID
            let blockedUserID = req.params.blockedUserID
            let result = await UnblockUser(currentUserID, blockedUserID)
            res.status(200).send({msg: result.msg})
        }
        catch(err)
        {
            res.status(400).send({msg: 'Something went wrong.', err: err})
        }
        
    })

    app.get('/GetAllSearchedEvents', async(req,res) => {
        try{
            let result = await GetAllSearchedEvents()
            res.status(200).send({msg: 'Events successfully fetched', result: result})
        }
        catch(err)
        {
            res.status(400).send({msg: 'Something went wrong.', err: err})

        }
    })

    app.get('/getBlockedUsers', async(req,res) => {
        try{
            let userToken = req.session.userToken
            let userTokenValidated = await validateToken(userToken)
            let userID = userTokenValidated.userID
            let result = await GetBlockedUsers(userID)
            res.status(200).send({msg: 'Blocked users list retrieved', users: result})
        }
        catch(err)
        {
            res.status(400).send({msg: 'something went wrong', err: err})
        }
    })

    app.get('/getUserPosts/:userID', async(req,res) => {
        try{
            
            let userID = Number(req.params.userID)
            let result = await GetUserPosts(userID)
            res.status(200).send({msg: 'User posts list retrieved', posts: result})
        }
        catch(err)
        {
            console.log(err)
            res.status(400).send({msg: 'something went wrong', err: err})
        }
    })

    app.get('/getPostComments/:postID', async(req,res) => {
        try{
            
            let postID = Number(req.params.postID)
            let result = await GetPostComments(postID)
            res.status(200).send({msg: 'Posts comments list retrieved', comments: result})
        }
        catch(err)
        {
            console.log(err)
            res.status(400).send({msg: 'something went wrong', err: err})
        }
    })

    app.post('/createPost', upload.array('postImage', 8), async(req,res) => {
        try{
            let postContent = req.body.PostContent
            
            let userToken = validateToken(req.session.userToken)
            let userID = Number(userToken.userID)

            let postImages = []
            if(req.files)
            {
                for(let image of req.files)
                {
                    postImages.push(fs.readFileSync(path.join(__dirname + '/uploads/' + image.filename)))
                }
            }

            let postDate = new Date().toISOString()

            let targetPostID = Number(req.body.targetPostID)

            let result = await CreatePost(userID, postContent, postDate, postImages, targetPostID)
            res.status(200).send({msg: 'Posts comments list retrieved', comments: result})

        }
        catch(err)
        {
            console.log(err)
            res.status(400).send({msg: 'something went wrong', err: err})

        }
    })

    app.post('/updatePost/:postID', async(req,res) => {
        try{
            let postID = Number(req.params.postID)
            let updatedContent = req.body.updatedContent;
            let result = await UpdatePost(postID, updatedContent)
            res.status(200).send({msg: 'Posts comments list retrieved', comments: result})
        }
        catch(err)
        {
            console.log(err)
            res.status(400).send({msg: 'something went wrong', err: err})
        }
    })

    app.get('/getTotalPostLikes/:PostID', async(req,res) => {
        try{
            let postID = Number(req.params.PostID)
            let result = await GetTotalPostLikes(postID)
            res.status(200).send({msg: 'Posts likes ammount retrieved', likesAmount: result})
        }
        catch(err)
        {
            console.log(err)   
        }
    })

    app.get('/hasUserLikedPost/:PostID', async(req,res) => {
        try{
            let userToken = req.session.userToken
            let userTokenValidated = validateToken(userToken)
            let userID = userTokenValidated.userID
            let postID = Number(req.params.PostID)
            let result = await GetPostLikers(userID, postID)
            res.status(200).send({msg: 'Posts likers retrieved', LikersIDList: result})
        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.post('/likePost/:PostID', async(req,res) => {
        try{
            let userToken = req.session.userToken
            let userTokenValidated = validateToken(userToken)
            let userID = userTokenValidated.userID
            let postID = Number(req.params.PostID)
            let result = await LikePost(userID, postID)
            res.status(200).send({msg: 'Posts likers retrieved', LikersIDList: result})
        }
        catch(err)
        {
            console.log(err)
        }

    } )

    app.get('/getPostShares/:PostID', async(req,res) => {
        try{
            let postID = Number(req.params.PostID)
            let result = await GetPostShares(postID)
            res.status(200).send({msg: 'Posts likers retrieved', PostSharesAmount: result})
        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.post('/sharePost/:PostID', async(req,res) => {
        try{
            let userToken = req.session.userToken
            let userTokenValidated = validateToken(userToken)
            let userID = userTokenValidated.userID
            let postID = Number(req.params.PostID)
            let result = await SharePost(userID, postID)
            res.status(200).send({msg: 'Posts likers retrieved', LikersIDList: result})
        }
        catch(err)
        {
            console.log(err)
        }
    } )
    // TODO: Delete if useless
    app.get('/getUserSharedPosts/:UserID', async(req,res) => {
        try{
            let userID = Number(req.params.UserID)
            let result = await SharePost(userID)
            res.status(200).send({msg: 'User shared posts retrieved', LikersIDList: result})
        }
        catch(err)
        {
            console.log(err)

        }
    })

    app.delete('/deleteSharedPost/:PostID', async(req,res) => {
        try{
            // TODO: Add check if user is owner of the shared post before deleting
            let userToken = req.session.userToken
            let userTokenValidated = validateToken(userToken)
            let userID = userTokenValidated.userID
            let postID = Number(req.params.PostID)
            let result = await DeleteSharedPost(userID, postID)
            res.status(200).send({msg: 'Posts successfully deleted'})
        }
        catch(err)
        {
            console.log(err)
        }
    } )

    app.post('/saveUserPreference', async(req,res) => {
        try{
            let userToken = req.session.userToken
            let userTokenValidated = validateToken(userToken)
            let userID = userTokenValidated.userID
            let eventType = req.body.EventType
            await SaveUserLatestPreference(userID, eventType)
            let result = await SaveUserPreference(userID, eventType)
            res.status(200).send({msg: 'Preference successfully recorded'})
        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.get('/GetUserPreferences', async(req,res) => {
        try{
            let userToken = req.session.userToken
            let userTokenValidated = validateToken(userToken)
            let userID = userTokenValidated.userID
            let eventType = req.body.EventType
            let result = await GetUserPreferences(userID)
            res.status(200).send({msg: 'Preferences successfully retrieved', result: result})
        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.get('/GetEventImages/:EventID', async(req,res) => {
        try{
            let result = await GetEventImages(req.params.EventID)
            res.status(200).send({msg: 'Event images successfully retrieved', result: result})

        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.post('/UploadPostImages/:PostID', async(req,res) => {
        try{
            try{
                let postID = Number(req.params.postID)
                let userData = validateToken(req.session.userToken)
                let postImages = []
                for(let image of req.files)
                {
                    postImages.push(fs.readFileSync(path.join(__dirname + '/uploads/' + image.filename)))
                }
                let result = await UploadPostImages(userData.userID, postID, postImages)
                res.status(result.status).send(result.msg)
            }
            catch(err){
                console.log(err)
                res.status(500).send('Internal server error.')
            }

        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.post('/SaveNotifications', async(req,res) => {
        try
        {   
            let SenderID = req.body.SenderID
            let ReceiverID = req.body.ReceiverID
            let NotificationContent = req.body.NotificationContent
            let NotificationDate = req.body.NotificationDate
            let NotificationType = req.body.NotificationType
            let result = await SaveNotification(SenderID, ReceiverID, NotificationContent, NotificationDate, NotificationType)

            res.status(200).send({msg: 'Notifications successfully stored on the databse', data: result})
        }
        catch(err)
        {
            res.status(500).send('Internal server error.')
        }
    })

    app.get('/GetUserNotifications', async(req,res) => {
        try{
            let UserID = validateToken(req.session.userToken).userID
            let result = await GetUserNotifications(UserID)
            res.status(200).send({msg: 'Notifications successfully retrieved.', data: result})

        }
        catch(err)
        {
            console.log(err)
        }
    })

    app.post('/MarkNotificationAsRead', async(req,res) => {
        try{
            let NotificationID = req.body.NotificationID
            let result = await MarkNotificationAsRead(NotificationID)
            res.status(200).send({msg: 'Notifications successfully marked as read.', data: result})

        }
        catch(err)
        {
            console.log(err)
        }
    })

    io.on('connection', (socket) => {
    
        socket.on('requestConvo', async (requestData) => {
            let senderID = requestData.senderID
            let receiverID = requestData.receiverID
            // TODO: Call the get convo, in general, only if the user is visiting ANY OTHER PROFILE PAGE THAN ITS OWN
            try{
                let targetConvo = await CheckIfConversationExists(senderID, receiverID)
                let targetConvoID = targetConvo.data[0].ConvoID
                let convoMessages = await GetConversationMessages(targetConvoID)
                socket.emit('getConvo', convoMessages)
            }
            catch(err)
            {
                console.log(err)
            }
        })

        socket.on('notify', (requestData) => {
            let isNotificationMessage = requestData.isMessage
            let isNotificationPost = requestData.isPost
            let isNotificationFollower = requestData.isFollower
            let isNotificationComment = requestData.isComment
            let isNotificationLike = requestData.isLike
            let isNotificationShare = requestData.isShare

            console.log(requestData)
            if(isNotificationMessage == true)
            {
                io.emit('receiveMessageNotification', 
                {
                    receiverID: requestData.notificationData.receiverID, 
                    senderID: requestData.notificationData.senderID, 
                    notificationType: 'msg'
                })
            }
            else if(isNotificationPost == true)
            {
                console.log(`${requestData.notificationData.senderID} posted to their followers.`)
                io.emit('receivePostNotification', 
                {   
                    postID: requestData.notificationData.postID,
                    receiverID: requestData.notificationData.receiverID, 
                    senderID: requestData.notificationData.senderID, 
                    notificationType: 'post'
                })
            }
            else if(isNotificationFollower == true)
            {
                console.log(`${requestData.notificationData.senderID} started following ${requestData.notificationData.receiverID}.`)
                io.emit('newFollowerNotification', 
                {   
                    receiverID: requestData.notificationData.receiverID,
                    senderID: requestData.notificationData.senderID, 
                    notificationType: 'follower'
                })
            }
            else if(isNotificationComment == true)
            {
                console.log(`${requestData.notificationData.senderID} commented on post ${requestData.notificationData.postID}.`)
                io.emit('newCommentNotification', 
                {   
                    postID: requestData.notificationData.postID,
                    receiverID: requestData.notificationData.receiverID,
                    senderID: requestData.notificationData.senderID, 
                    notificationType: 'comment'
                })
            }
            else if(isNotificationShare == true)
            {
                console.log(`${requestData.notificationData.senderID} shared post ${requestData.notificationData.postID}.`)
                io.emit('newShareNotification', 
                {   
                    postID: requestData.notificationData.postID,
                    receiverID: requestData.notificationData.receiverID,
                    senderID: requestData.notificationData.senderID, 
                    notificationType: 'share'
                })
            }
            else if(isNotificationLike == true)
            {
                console.log(`${requestData.notificationData.senderID} liked post ${requestData.notificationData.postID}.`)
                io.emit('newLikeNotification', 
                {   
                    postID: requestData.notificationData.postID,
                    receiverID: requestData.notificationData.receiverID,
                    senderID: requestData.notificationData.senderID, 
                    notificationType: 'like'
                })
            }
        })

        socket.on('disconnect', function() {
            console.log('User disconnected.');
        });
    });

    server.listen(port, () => {
        console.log(`Local server running on port: ${port}`)
    })
}

start()