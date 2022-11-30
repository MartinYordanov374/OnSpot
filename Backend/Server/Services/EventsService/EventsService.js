const sql = require('mssql')

async function HostEvent(EventHosterID, EventName, EventDescription, EventLocation, EventClass, EventType, EventDate)
{
    let result = await sql.query`
    INSERT INTO dbo.Events(EventHosterID, EventName, EventDescription, EventLocation, EventClass, EventType, EventDate) 
    VALUES(${EventHosterID}, ${EventName}, ${EventDescription}, ${EventLocation}, ${EventClass}, ${EventType}, ${EventDate})`

    return result
}

async function CheckIfUserAlreadyCreatedEvent(EventHosterID, EventName,EventDate)
{
    let result = await sql.query`
    SELECT * FROM dbo.Events 
    WHERE EventHosterID = ${EventHosterID} 
    AND EventName = ${EventName} 
    AND EventDate = ${EventDate}`

    return result.recordset.length
}

async function DeleteEvent(EventID, EventHosterID)
{
    let eventExistsAndUserIsOwner = true ? await CheckIfUserEventExists(EventID, EventHosterID) >= 1 : false

    if (eventExistsAndUserIsOwner == true)
    {
        try{
            await sql.query`DELETE FROM dbo.Events WHERE EventID = ${EventID}`
            return {status: 200, msg:'Event successfully deleted.'}
        }
        catch(err)
        {
            return {status: 500, msg:'Internal server error.'}
        }
    }
    else
    {
        return {status: 409, msg:`Event with ID ${EventID} does not exist or you are not the owner of this event.`}
    }
}

async function CheckIfUserEventExists(EventID, EventHosterID)
{
    let result = await sql.query`SELECT * FROM dbo.Events WHERE EventID = ${EventID} AND EventHosterID = ${EventHosterID}`
    return result.recordset.length
}

async function AttendEvent(UserID, EventID)
{
    // owner attends by default
    // un-attend if you are already attending
    let userAttendsAlready = await CheckIfUserAlreadyAttendsEvent(UserID, EventID)
    if(userAttendsAlready == true)
    {
        try{
            await sql.query`DELETE FROM dbo.AttendancesTable WHERE EventID = ${EventID} AND UserID = ${UserID}`
            return {status: 200, msg: 'You no longer attend this event!'}
        }
        catch(err)
        {
            return {status: 500, msg: 'Internal server error.'}
        }
    }
    else
    {
        try{
            await sql.query`INSERT INTO dbo.AttendancesTable(EventID, UserID) VALUES(${EventID}, ${UserID})`
            return {status: 200, msg: 'You now attend this event!'}
            
        }
        catch(err)
        {
            return {status: 500, msg: 'Internal server error.'}
        }
    }
}

async function CheckIfUserAlreadyAttendsEvent(UserID, EventID)
{
    let result = await sql.query`SELECT * FROM dbo.AttendancesTable WHERE EventID = ${EventID} AND UserID = ${UserID}`
    let userAttendsAlready = true ? result.recordset.length >= 1 : false

    return userAttendsAlready
}

async function GetAllEvents()
{
    try{
        let result = await sql.query`SELECT * FROM dbo.Events`
        return {status: 200, msg: 'Events successfully fetched from the database.', payload: result.recordset}
    }
    catch(err)
    {
        return {status: 500, msg: 'Internal server error.'}
    }
}

module.exports = {
    HostEvent,
    CheckIfUserAlreadyCreatedEvent,
    DeleteEvent,
    AttendEvent,
    GetAllEvents
}