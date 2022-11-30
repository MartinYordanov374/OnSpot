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

async function DeleteEvent(EventID)
{
    let eventExists = true ? await CheckIfEventExists(EventID) >= 1 : false

    if (eventExists)
    {
        try{
            let result = await sql.query`DELETE FROM dbo.Events WHERE EventID = ${EventID}`
            return {status: 200, msg:'Event successfully deleted.'}
        }
        catch(err)
        {
            return {status: 500, msg:'Internal server error.'}
        }
    }
    else
    {
        return {status: 404, msg:`Event with ID ${EventID} does not exist.`}
    }
}

async function CheckIfEventExists(EventID)
{
    let result = await sql.query`SELECT * FROM dbo.Events WHERE EventID = ${EventID}`
    return result.recordset.length
}

module.exports = {
    HostEvent,
    CheckIfUserAlreadyCreatedEvent,
    DeleteEvent
}