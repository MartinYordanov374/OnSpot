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
    let result = await sql.query`SELECT * FROM dbo.users WHERE id = ${id}`
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
    if(await CheckIfUserFollowsGivenUser(FollowerUserID, FollowedUserID) == true)
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

    if(followerUserExists == true && followedUserExists == true)
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
    let followers = result.recordset.length
    return {status: 200, msg:'followers successfully fetched', followers: followers}
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
    AddUserBio
}