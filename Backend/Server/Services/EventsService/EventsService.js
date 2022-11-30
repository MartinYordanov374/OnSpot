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

async function AttendEvent(EventID, UserID)
{
    // owner attends by default
    // un-attend if you are already attending
}

async function CheckIfUserAlreadyAttendsEvent(EventID, UserID)
{
    let userAttends = await sql.query`SELECT * FROM dbo.AttendacesTable WHERE EventID = ${EventID} AND UserID = ${UserID}`

}

module.exports = {
    HostEvent,
    CheckIfUserAlreadyCreatedEvent,
    DeleteEvent
}