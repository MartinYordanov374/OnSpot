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

module.exports = {
    HostEvent,
    CheckIfUserAlreadyCreatedEvent
}