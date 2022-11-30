const bcrypt = require('bcrypt')
const sql = require('mssql')
const jwt = require('jsonwebtoken')
const saltRounds = Number(process.env.REACT_APP_SALT_ROUNDS)

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

async function LoginUser(username, password)
{
    let targetUser = await (await UserExists(username)).recordset
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
    console.log(FollowerUserID, FollowedUserID)
    // check if user already follows that user
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
    UserExists, 
    LoginUser,
    FollowUser,
    validateToken
}