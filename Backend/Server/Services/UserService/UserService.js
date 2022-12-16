const bcrypt = require('bcrypt')
const sql = require('mssql')
const jwt = require('jsonwebtoken')
const saltRounds = Number(process.env.REACT_APP_SALT_ROUNDS)

async function registerUser(username, password, email)
{
    
    let hashedPass = await bcrypt.hash(password, saltRounds)
    await sql.query`INSERT INTO dbo.USERS(Username, Email, HashedPassword) VALUES(${username}, ${email}, ${hashedPass})`
    
}

async function UserExistsByUsername(username)
{
    let result = await sql.query`SELECT * FROM dbo.users WHERE username = ${username}`
    return result
}

async function UserExistsByEmail(email)
{
    let result = await sql.query`SELECT * FROM dbo.users WHERE Email = ${email}`
    return result
}

async function UserExistsById(id)
{
    let result = await sql.query`   	
    SELECT id, Email, Username, Followers, bio, ProfilePicture
    FROM dbo.USERS u
    LEFT JOIN ProfilePictures pp 
    ON U.id = pp.UserID
    WHERE id = ${id}`
    return result
}

async function LoginUser(username, password)
{
    let targetUser = await (await UserExistsByEmail(username)).recordset
    if(targetUser.length > 0)
    {
        if(await bcrypt.compare(password, targetUser[0].HashedPassword))
        {
            return {status: 200, msg: 'User logged in successfully.', targetUserID: targetUser[0].id}
        }
        else{
            return {status: 401, msg: 'Wrong password.'}
        }
    }
    else
    {
        return {status: 404, msg: 'This user does not exist'}
    }
}

async function FollowUser(FollowerUserID, FollowedUserID)
{   
    let userAlreadyFollowsGivenUser = await CheckIfUserFollowsGivenUser(FollowerUserID, FollowedUserID);
    console.log(userAlreadyFollowsGivenUser)
    if(userAlreadyFollowsGivenUser == true)
    {
        try{
            await sql.query`DELETE FROM dbo.FollowersTable WHERE FollowerUserID = ${FollowerUserID} and FollowedUserID = ${FollowedUserID}`
            return {status: 200, msg: 'You no longer follow this user.'}
        }   
        catch(err)
        {
            return {status: 500, msg: 'Internal server error.'}
        }
        
    }
    else
    {
        try{
            await sql.query`INSERT INTO dbo.FollowersTable(FollowerUserID, FollowedUserID) VALUES(${FollowerUserID}, ${FollowedUserID})`
            return {status: 200, msg: 'You now follow this user.'}
        }
        catch(err)
        {
            return {status: 500, msg: 'Internal server error.'}
        }
    }
}

async function CheckIfUserFollowsGivenUser(FollowerUserID, FollowedUserID)
{
    let followerUserExists = await UserExistsById(FollowerUserID)
    let followedUserExists = await UserExistsById(FollowedUserID)

    if(followerUserExists && followedUserExists )
    {
        let result = await sql.query`SELECT * FROM dbo.FollowersTable WHERE FollowerUserID = ${FollowerUserID} AND FollowedUserID = ${FollowedUserID}`
        if(result.recordset.length >= 1)
        {
            return true
        }
        else
        {
            return false
        }
    }
    else
    {
        return {status: 409, msg: 'You cannot do this action with non-existing users.'}
    }


}

async function GetUserFollowers(userID)
{
    let result = await sql.query`SELECT FollowerUserID FROM dbo.FollowersTable WHERE FollowedUserID = ${userID}`
    let userFollowersResponse = result.recordset
    return {status: 200, msg:'followers successfully fetched', followers: userFollowersResponse}
}

async function DeleteProfile(userToken, ProfileID)
{
    let tokenData = validateToken(userToken)
    if(tokenData.status == true)
    {
        if(tokenData.userID == ProfileID)
        {
            try{
                await sql.query`DELETE FROM Users WHERE id = ${ProfileID}`
                return {status: 200, msg: 'Profile successfully deleted.'}
            }
            catch(err)
            {
                return {status: 500, msg: 'Internal server error.'}
            }
        }
        else
        {
            return {status: 409, msg: 'You can not do this action.'}
        }
    }
}

async function GetUserEvents(userID)
{
    let userExists = await UserExistsById(userID)
    if(userExists.recordset.length >= 1)
    {
        try{
            let result = await sql.query`SELECT * FROM dbo.Events where EventHosterID = ${userID}`
            return {status: 200, userEvents: result.recordset}
        }
        catch(err)
        {
            console.log(err)
            return {status: 500, msg: 'Internal server error.'}
        }
    }
    else
    {
        return {status: 404, msg: 'This user does not exist.'}
    }
}

async function AddUserBio(userToken, ProfileID, UpdatedBio)
{
    let tokenData = validateToken(userToken)
    if(tokenData.status == true)
    {
        if(tokenData.userID == ProfileID)
        {
            await sql.query`UPDATE dbo.Users SET bio = ${UpdatedBio} WHERE id = ${tokenData.userID}`
            return {status: 200, msg: 'Bio successfully updated.'}
        }
        else
        {
            return {status: 409, msg: 'You can not do this action.'}
        }
    }
}

async function GetUserAttendedEvents(userID)
{
    let userExists = await UserExistsById(userID)
    if(userExists.recordset.length >= 1)
    {
        try{
            let result = await sql.query`SELECT * FROM Events WHERE EventID = (SELECT EventID FROM AttendancesTable WHERE UserID = ${userID})`
            return {status: 200, userEvents: result.recordset}
        }
        catch(err)
        {
            console.log(err)
            return {status: 500, msg: 'Internal server error.'}
        }
    }
    else
    {
        return {status: 404, msg: 'This user does not exist.'}
    }
}

async function ChangeProfilePicture(userID, profilePicture)
{
    let userExists = await UserExistsById(userID)
    if(userExists.recordset.length >= 1)
    {
        // check if user has already uploaded profile picture, if so change it otherwise insert it
        try{
            let hasUserUploadedProfilePicture = await GetUserProfilePicture(userID)
            console.log(hasUserUploadedProfilePicture)
            if(hasUserUploadedProfilePicture.status == 200)
            {
                await sql.query`UPDATE dbo.ProfilePictures SET ProfilePicture = ${profilePicture.data} WHERE UserID = ${userID}`
                return {status: 200, msg: 'Profile picture successfully updated.'}
            }
            else
            {
                await sql.query`IF NOT EXISTS (SELECT * FROM dbo.ProfilePictures WHERE UserID = ${userID}) INSERT INTO dbo.ProfilePictures(UserID, ProfilePicture) VALUES(${userID}, ${profilePicture.data})`
                return {status: 200, msg: 'Profile picture successfully uploaded.'}
            }
        }
        catch(err)
        {
            return {status: 500, msg: 'Profile picture successfully uploaded.'}
        }
    }
    else
    {
        return {status: 409, msg: 'You can not do that.'}
    }
}

async function GetUserProfilePicture(userID)
{
    let userExists = await UserExistsById(userID)
    if(userExists.recordset.length >= 1)
    {        
        try{
            let result = await sql.query`SELECT * FROM dbo.ProfilePictures WHERE UserID = ${userID}`
            if(result.recordset.length >= 1)
            {
                return {status: 200, msg: 'Profile picture successfully retrieved.', data: result}
            }
            else
            {
                return {status: 404, msg: 'Profile picture not found.'}
            }
        }
        catch(err)
        {
            return {status: 500, msg: 'Profile picture retrieval failed.'}
        }
    }
    else
    {
        return {status: 409, msg: 'This user does not exist.'}
    }
}

async function CheckIfConversationExists(SenderID, ReceiverID)
{
    // TODO: if we do the query for users with ID 1 and 2 in this order, we'll get a result. 
    // Figure out a way to get the same result when you switch the numbers, otherwise both users messaging each other would be chatting in different chats.

    try{
        let result = await sql.query`
        SELECT ConvoID 
        FROM Conversations 
        WHERE (UserOneID = ${SenderID} AND UserTwoID = ${ReceiverID}) 
        OR (UserTwoID = ${ReceiverID} AND UserTwoID = ${SenderID})`

        if(result.recordset.length >= 1)
        {
            // TODO: get the convo chats  
            return {status: 200, msg: 'Conversation Exists!', convoExists: true, data: result.recordset}
        }
        else
        {
            return {status: 404, msg: 'Conversation does not exist!', convoExists: false}

        }
    }
    catch(err)
    {
        return {status: 500, msg: 'Internal server error.', error: err}
    }
}

async function SendMessage(ConvoID, Message, SenderID)
{
    try{
        let result = await sql.query`INSERT INTO Messages(ConvoID, Message, SenderUserID) VALUES(${ConvoID}, ${Message}, ${SenderID})`
        return {status: 200, msg: 'Message sent successfully!'}
    }
    catch(err)
    {
        return {status: 500, msg: 'Internal server error.', error: err}
    }
}

async function CreateConversation(SenderID, ReceiverID)
{
    try{
        let result = await sql.query`INSERT INTO Conversations(UserOneID, UserTwoID) VALUES(${SenderID}, ${ReceiverID})`
        let newlyCreatedConvo = await CheckIfConversationExists(SenderID, ReceiverID)
        return {status:200, msg: 'Successfully created conversation.', data: newlyCreatedConvo}
    }
    catch(err)
    {
        return {status:500, msg: 'Internal server error.', error: err}
    }
}

async function GetConversationMessages()
{
    try{
        let result = await sql.query`SELECT * 
        FROM Messages 
        WHERE ConvoID = ${ConvoID}`
        return {status: 200, msg: 'Chat messages successfully fetched', data: result.recordset}
    }
    catch(err)
    {
        return{status: 500, msg: 'Internal server error.', error: err}
    }
}
function validateToken(token)
{
    try{
        const verified = jwt.verify(token, process.env.REACT_APP_SECRET);
        const userID = jwt.decode(token)
        if(verified){
            return {status: true, userID: userID}
        }else{
            // Access Denied
            return false
        }
    }
    catch(err)
    {
        console.log(err)
        return {status: 500, message: 'Internal server error.' }
    }
}




module.exports = {
    registerUser,
    UserExistsByUsername,
    UserExistsByEmail, 
    LoginUser,
    FollowUser,
    validateToken,
    GetUserFollowers,
    DeleteProfile,
    GetUserEvents,
    GetUserAttendedEvents,
    AddUserBio,
    UserExistsById,
    ChangeProfilePicture,
    GetUserProfilePicture,
    CheckIfConversationExists,
    SendMessage,
    CreateConversation,
    GetConversationMessages
}