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
    SELECT id, Email, Username, Followers, bio, ProfilePicture, HashedPassword
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

async function BlockUser(blockerUserID, blockedUserID)
{
    //TODO: CHECK IF BLOCKED USER EXISTS
    try
    {
        await sql.query`INSERT INTO dbo.BlockedUsers(BlockerUserID, BlockedUserID) VALUES(${blockerUserID}, ${blockedUserID})`
        return {status: 200, msg: 'User was blocked!'}
    }
    catch(err)
    {
        return {status: 400, msg: 'Something went wrong.', err: err}
    }
}

async function UnblockUser(blockerUserID, blockedUserID)
{
    //TODO: CHECK IF BLOCKED USER EXISTS
    try
    {
        await sql.query`DELETE FROM dbo.BlockedUsers WHERE BlockedUserID = ${blockedUserID} AND BlockerUserID = ${blockerUserID}`
        return {status: 200, msg: 'User was unblocked!'}
    }
    catch(err)
    {
        return {status: 400, msg: 'Something went wrong.', err: err}
    }
}

async function GetBlockedUsers(blockerUserID)
{
    try
    {
        let result = await sql.query`SELECT Username, ProfilePicture, BlockedUserID FROM dbo.BlockedUsers
        LEFT JOIN Users u 
        on u.id = BlockedUserID
        LEFT JOIN ProfilePictures pp 
        on pp.UserID = BlockedUserID 
        WHERE BlockerUserID = ${blockerUserID}`
        return {status: 200, blockedUsersList: result }
    }
    catch(err)
    {
        return {status: 400, msg: 'Something went wrong.', err: err}
    }
}

async function FollowUser(FollowerUserID, FollowedUserID)
{   
    let userAlreadyFollowsGivenUser = await CheckIfUserFollowsGivenUser(FollowerUserID, FollowedUserID);
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
                await sql.query`DELETE FROM Events WHERE EventHosterID = ${ProfileID}`
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
            return {status: 500, msg: 'Profile picture failed to upload.'}
        }
    }
    else
    {
        return {status: 409, msg: 'You can not do that.'}
    }
}

async function ChangeBackgroundPicture(userID, BackgroundPicture)
{
    let userExists = await UserExistsById(userID)
    if(userExists.recordset.length >= 1)
    {
        // check if user has already uploaded profile picture, if so change it otherwise insert it
        try{
            let hasUserUploadedBackgroundPicture = await GetUserBackgroundPicture(userID)
            if(hasUserUploadedBackgroundPicture.status == 200)
            {
                await sql.query`UPDATE dbo.BackgroundPictures SET BackgroundPicture = ${BackgroundPicture.data} WHERE UserID = ${userID}`
                return {status: 200, msg: 'Background picture successfully updated.'}
            }
            else
            {
                await sql.query`IF NOT EXISTS (SELECT * FROM dbo.BackgroundPictures WHERE UserID = ${userID}) INSERT INTO dbo.BackgroundPictures(UserID, BackgroundPicture) VALUES(${userID}, ${BackgroundPicture.data})`
                return {status: 200, msg: 'Background picture successfully uploaded.'}
            }
        }
        catch(err)
        {
            return {status: 500, msg: 'Background picture failed to upload.', err: err}
        }
    }
    else
    {
        return {status: 409, msg: 'You can not do that.'}
    }
}
async function GetUserBackgroundPicture(userID)
{
    let userExists = await UserExistsById(userID)
    if(userExists.recordset.length >= 1)
    {        
        try{
            let result = await sql.query`SELECT * FROM dbo.BackgroundPictures WHERE UserID = ${userID}`
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
        OR (UserOneID = ${ReceiverID} AND UserTwoID = ${SenderID})`

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
        let result = await sql.query`INSERT INTO Messages(ConvoID, Message, SenderUserID, DateSent) VALUES(${ConvoID}, ${Message}, ${SenderID}, ${new Date()})`
        return {status: 200, msg: 'Message sent successfully!'}
    }
    catch(err)
    {
        console.log(err)
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

async function GetConversationMessages(ConvoID)
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

async function updateUsername(userID, username)
{
    try{
        let result = await sql.query`UPDATE dbo.Users SET Username = ${username} WHERE id = ${userID}`
        return {status: 200, msg:'Username updated successfully'}
    }
    catch(err)
    {
        return {status: 500, err: err}
    }
}

async function updateEmail(userID, email)
{
    try{
        let result = await sql.query`UPDATE dbo.Users SET Email = ${email} WHERE id = ${userID}`
        return {status: 200, msg:'Email updated successfully'}
    }
    catch(err)
    {
        return {status: 500, err: err}
    }
}

async function updateBio(userID, Bio)
{
    try{
        let result = await sql.query`UPDATE dbo.Users SET bio = ${Bio} WHERE id = ${userID}`
        return {status: 200, msg:'Bio updated successfully'}
    }
    catch(err)
    {
        return {status: 500, err:err}
    }
}

async function GetUserPosts(userID)
{
    try{
        let result = await sql.query`SELECT UserID, PostContent, PostDate, P.PostID, pc.CommentID, pc.PostID as CommentParentID FROM Posts p 
        LEFT JOIN PostComments pc 
        ON p.PostID = pc.CommentID  
        WHERE pc.PostID IS NULL 
        AND UserID = ${userID}`
        return {status: 200, msg:'Posts fetched successfully', result: result}
    }
    catch(err)
    {
        return {status: 500, err:err}
    }
}

async function GetPostImages(UserID)
{
    try{
        let result = await sql.query`
        SELECT pi2.PostID, pi2.PostImage FROM PostImages pi2 
        LEFT JOIN Posts p 
        ON p.PostID = pi2.PostID 
        WHERE p.UserID = ${UserID}`

        return result
    }
    catch(err)
    {
        console.log(result)
    }
}


async function GetPostComments(PostID)
{
    try{
        let result = await sql.query`
        SELECT * FROM dbo.PostComments pc
        LEFT JOIN dbo.Posts p
        ON p.PostID  = pc.CommentID 
        WHERE pc.PostID = ${PostID}`

        return {status: 200, msg:'Post comments fetched successfully', result: result}
    }
    catch(err)
    {
        console.log(err)
        return {status: 500, err:err}
    }
}

async function CreatePost(UserID, PostContent, PostDate, PostImages, targetPostID)
{
    try{
        if(!targetPostID)
        {
            let result = await sql.query`
            INSERT INTO dbo.Posts(UserID, PostContent, PostDate) VALUES (${UserID}, ${PostContent}, ${PostDate})`
            if(PostImages.length > 0)
            {
                let newPost = await sql.query`SELECT * from dbo.Posts WHERE UserID = ${UserID} AND PostContent = ${PostContent}`
                let newPostID = newPost.recordset[0].PostID
                newPostData = newPost

                for(let PostImage of PostImages)
                {
                    await sql.query`INSERT INTO dbo.PostImages(PostID, PostImage) VALUES(${newPostID}, ${PostImage})`
                }
            }
        }
        else
        {
            let createPostResult = await sql.query`
            INSERT INTO dbo.Posts(UserID, PostContent, PostDate) VALUES (${UserID}, ${PostContent}, ${PostDate})`

            let commentResult = await sql.query`SELECT * from dbo.Posts WHERE UserID = ${UserID} AND PostContent = ${PostContent}`
            let commentID = commentResult.recordset[0].PostID

            let createCommentResult = await sql.query`
            INSERT INTO dbo.PostComments(PostID, CommentID) VALUES (${targetPostID},${commentID})`
        }

        return {status: 200, msg:'Post successfully created'}
    }
    catch(err)
    {
        return {status: 500, err:err}
    }
}

async function DeletePost(postID)
{
    try{
        //TODO: ADD CHECK IF CURRENT USER IS OWNER s
        let result = await sql.query`DELETE FROM dbo.Posts WHERE postID = ${postID}`
        return {status: 200, msg:'Post successfully created', result: result}
    }
    catch(err)
    {
        console.log(err)
        return {status: 500, err:err}
    }
}

async function UpdatePost(postID, updatedContent)
{
    try{
        let result = await sql.query
        `
        UPDATE dbo.Posts 
        SET PostContent = ${updatedContent}
        WHERE postID = ${postID}
        `
        return {status: 200, msg:'Post successfully updated', result: result}

    }
    catch(err)
    {
        console.log(err)
        return {status: 500, err:err}
    }
}

async function GetTotalPostLikes(PostID)
{
    try{
        let result = await sql.query`
        SELECT count(PostID) as postLikesTotal
        FROM PostLikes pl 
        WHERE PostID = ${PostID}`
        return {status: 200, msg:'Post liked successfully retrieved.', result: result}

    }
    catch(err)
    {
        console.log(err)
        return {status: 500, err:err}
    }
}
// TODO: Rename to HasUserLikedPost
async function GetPostLikers(UserID, PostID)
{
    try{
        let result = await sql.query`
        SELECT * 
        FROM PostLikes pl 
        WHERE PostID = ${PostID} and LikerID = ${UserID}`
        return {status: 200, msg:'Post likes successfully retrieved.', result: result}

    }
    catch(err)
    {
        return {status: 200, msg:'Post lies not retrieved.', result: err}
    }
}

async function LikePost(UserID, PostID)
{
    try{
        let result = await sql.query`
        IF NOT EXISTS 
            (
             SELECT * 
             FROM PostLikes pl 
             WHERE PostID = ${PostID} and LikerID = ${UserID}
            )
            INSERT INTO dbo.PostLikes(PostID, LikerID) 
            VALUES(${PostID}, ${UserID})
        ELSE 
            DELETE FROM dbo.PostLikes WHERE PostID = ${PostID} and LikerID = ${UserID}`
        return {status: 200, msg:'Post successfully liked.'}

    }
    catch(err)
    {
        return {status: 200, msg:'Something went wrong.', result: err}
    }
}

async function GetPostShares(PostID)
{
    try{
        let result = await sql.query`
        SELECT count(PostID) as postSharesTotal
        FROM PostShares ps 
        WHERE PostID = ${PostID}`
        return {status: 200, msg:'Post shares successfully retrieved.', result: result}

    }
    catch(err)
    {
        return {status: 200, msg:'Post shares not retrieved.', result: err}
    }
}
async function SharePost(UserID, PostID)
{
    try{
        let result = await sql.query`
        IF NOT EXISTS (SELECT * FROM PostShares ps WHERE PostID = ${PostID} AND SharerID = ${UserID})
        INSERT INTO dbo.PostShares(PostID, SharerID) 
                   VALUES(${PostID}, ${UserID})`
        return {status: 200, msg:'Post successfully shared.'}

    }
    catch(err)
    {
        return {status: 200, msg:'Something went wrong.', result: err}
    }
}
async function GetUserSharedPosts(sharerID)
{
    try{
        let result = await sql.query`
        SELECT p.UserID, p.PostContent, p.PostDate, p.PostID, ps.SharerID 
        FROM Posts p 
        inner JOIN PostShares ps
        ON p.PostID = ps.PostID  
        WHERE ps.SharerID = ${sharerID}`
        return {status: 200, msg:'Post successfully shared.', result: result}
    }
    catch(err)
    {
        console.log(err)
    }
}
async function DeleteSharedPost(UserID, PostID)
{
    try{
        let result = await sql.query`
        DELETE FROM dbo.PostShares WHERE SharerID=${UserID} AND PostID = ${PostID}`
        return {status: 200, msg:'Post successfully deleted.'}

    }
    catch(err)
    {
        return {status: 200, msg:'Something went wrong.', result: err}
    }
}

async function SaveUserPreference(UserID, EventType)
{
    try{
        let result = await sql.query`
        INSERT INTO dbo.Analytics(UserID, EventType) VALUES(${UserID}, ${EventType})`
        return {status: 200, msg:'Post successfully deleted.'}
    }
    catch(err)
    {
        return {status: 200, msg:'Something went wrong.', result: err}
    }
}

async function GetUserPreferences(UserID)
{
    try{
        let result = await sql.query`
        SELECT 
            a.EventType, 
            CASE 
                WHEN lve.EventType = a.EventType 
                THEN COUNT(a.EventType) * 5 
                ELSE COUNT(a.EventType) 
            END AS EventOccurences 
        FROM Analytics a 
        LEFT JOIN LatestVisitedEvent lve 
            ON a.UserID = lve.UserID 
            AND a.EventType = lve.EventType 
            WHERE a.UserID = ${UserID}
        GROUP BY a.EventType, lve.EventType 
    `
        return {status: 200, msg:'Preferences successfully retrieved.', data: result}
    }
    catch(err)
    {
        return {status: 200, msg:'Something went wrong.', result: err}
    }
}

async function SaveUserLatestPreference(UserID, EventType)
{
    try{
        let result = await sql.query`
        IF NOT EXISTS 
		    (SELECT UserID FROM dbo.LatestVisitedEvent lve WHERE UserID = ${UserID}) 
            INSERT INTO dbo.LatestVisitedEvent(UserID, EventType) VALUES(${UserID}, ${EventType}) 
        ELSE
            UPDATE dbo.LatestVisitedEvent SET UserID = ${UserID}, EventType = ${EventType} WHERE UserID = ${UserID}`

        return {status: 200, msg:'Post successfully deleted.', data: result}
    }
    catch(err)
    {
        return {status: 200, msg:'Something went wrong.', result: err}
    }
}

async function SaveNotification(SenderID, ReceiverID, NotificationContent, NotificationDate, NotificationType)
{
    try{
        if(NotificationType == 'msg')
        {
            let result = await sql.query`
            IF NOT EXISTS 
            (SELECT SenderID  FROM dbo.Notifications WHERE SenderID = ${SenderID} AND ReceiverID = ${ReceiverID}) 
                INSERT INTO dbo.Notifications(SenderID, ReceiverID, NotificationDate, IsNotificationRead, NotificationMessage) 
            VALUES(${SenderID}, ${ReceiverID}, ${NotificationDate}, 1, ${NotificationContent})`
            
            return {status: 200, msg:'Notification successfully saved.', data: result}
        }
        else if(NotificationType == 'post')
        {
            let result = await sql.query`
            IF NOT EXISTS 
            (SELECT SenderID  FROM dbo.Notifications WHERE SenderID = ${SenderID} AND ReceiverID = ${ReceiverID}) 
                INSERT INTO dbo.Notifications(SenderID, ReceiverID, NotificationDate, IsNotificationRead, NotificationMessage) 
            VALUES(${SenderID}, ${ReceiverID}, ${NotificationDate}, 1, ${NotificationContent})`
            
            return {status: 200, msg:'Notification successfully saved.', data: result}
        }
        else if(NotificationType == 'follower')
        {
            let result = await sql.query`
            IF NOT EXISTS 
            (SELECT SenderID  FROM dbo.Notifications WHERE SenderID = ${SenderID} AND ReceiverID = ${ReceiverID}) 
                INSERT INTO dbo.Notifications(SenderID, ReceiverID, NotificationDate, IsNotificationRead, NotificationMessage) 
            VALUES(${SenderID}, ${ReceiverID}, ${NotificationDate}, 1, ${NotificationContent})`
            
            return {status: 200, msg:'Notification successfully saved.', data: result}
        }
        else if(NotificationType == 'comment')
        {
            let result = await sql.query`
            IF NOT EXISTS 
            (SELECT SenderID  FROM dbo.Notifications WHERE SenderID = ${SenderID} AND ReceiverID = ${ReceiverID}) 
                INSERT INTO dbo.Notifications(SenderID, ReceiverID, NotificationDate, IsNotificationRead, NotificationMessage) 
            VALUES(${SenderID}, ${ReceiverID}, ${NotificationDate}, 1, ${NotificationContent})`
            
            return {status: 200, msg:'Notification successfully saved.', data: result}
        }
    }
    catch(err)
    {
        return {status: 200, msg:'Something went wrong.', result: err}
    }
}

async function GetUserNotifications(UserID)
{
    try{

        let result = await sql.query`        
        select n.*, u.Username  from Notifications n
        LEFT JOIN Users u
        on u.id = n.SenderID
        WHERE n.ReceiverID = ${UserID}`
        
        return {status: 200, msg:'Notification successfully retrieved.', data: result.recordset}
        
        //TODO: Handle the rest of the notifications
    }
    catch(err)
    {
        return {status: 500, msg:'Something went wrong.', err: err}
    }
}

async function MarkNotificationAsRead(NotificationID)
{
    try{
        let result = await sql.query`UPDATE Notifications 
        SET IsNotificationRead = 0
        WHERE NotificationID = ${NotificationID}`

        return {status: 200, msg:'Notification successfully marked as read.'}
    }
    catch(err)
    {
        return {status: 500, msg: 'Something went wrong.', err:err}
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
    GetConversationMessages, 
    ChangeBackgroundPicture,
    GetUserBackgroundPicture, 
    updateBio,
    updateEmail,
    updateUsername,
    BlockUser,
    UnblockUser,
    GetBlockedUsers,
    GetUserPosts,
    GetPostComments,
    CreatePost,
    DeletePost,
    UpdatePost,
    GetTotalPostLikes,
    GetPostLikers,
    LikePost,
    GetPostShares,
    SharePost,
    GetUserSharedPosts,
    DeleteSharedPost,
    SaveUserPreference,
    GetUserPreferences,
    SaveUserLatestPreference,
    GetPostImages,
    SaveNotification,
    GetUserNotifications,
    MarkNotificationAsRead
}