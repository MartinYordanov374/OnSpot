const sql = require('mssql')
const { validateToken } = require('../UserService/UserService')

async function HostEvent(EventHosterID, EventName, EventDescription, EventLocation, EventClass, EventType, EventStartDate, EventEndDate)
{
    let result = await sql.query`
    INSERT INTO dbo.Events(EventHosterID, EventName, EventDescription, EventLocation, EventClass, EventType, EventStartDate, EventEndDate) 
    VALUES(${EventHosterID}, ${EventName}, ${EventDescription}, ${EventLocation}, ${EventClass}, ${EventType}, ${EventStartDate}, ${EventEndDate})`

    return result
}

async function CheckIfUserAlreadyCreatedEvent(EventHosterID, EventName,EventStartDate, EventEndDate)
{
    // TODO: ADD EVENT END DATE AS WELL
    let result = await sql.query`
    SELECT * FROM dbo.Events 
    WHERE EventHosterID = ${EventHosterID} 
    AND EventName = ${EventName} 
    AND EventStartDate = ${EventStartDate}
    OR EventEndDate = ${EventEndDate}`

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

async function DoesUserAttendEvent(UserID, EventID)
{
    let result = await sql.query`SELECT * FROM dbo.AttendancesTable WHERE UserID = ${UserID} AND EventID = ${EventID}`
    if(result.recordset.length >= 1)
    {
        return true
    }
    else
    {
        return false
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
        // let result = await sql.query`SELECT * FROM dbo.Events`
        //TODO: FIX THE BUG WHICH CAUSES
        let result = await sql.query`
        SELECT DISTINCT
		e.EventName, 
		e.EventDescription, 
		e.EventHosterID, 
		e.EventType, 
		e.EventClass, 
		e.EventStartDate, 
		e.EventEndDate, 
		e.EventID, 
		e.EventLocation  
	FROM Events e
	LEFT JOIN 
		(SELECT UserID, EventType as EventClass, COUNT(EventType) AS EventOccurences 
		FROM Analytics a 
		GROUP BY UserID, EventType ) a
	ON a.UserID = e.EventHosterID 
	ORDER BY e.EventClass`
        return {status: 200, msg: 'Events successfully fetched from the database.', payload: result.recordset}
    }
    catch(err)
    {
        return {status: 500, msg: 'Internal server error.'}
    }
}

async function getEventById(eventId)
{
    // TODO: ADD CHECKS FOR VALID ID !
    let result = await sql.query`
    SELECT  EventName, EventDescription, EventType, EventClass, EventID, Bio, EventLocation,EventStartDate, EventEndDate, Username, id, ProfilePicture
    FROM dbo.Events e 
    INNER JOIN Users u 
    ON u.id = e.EventHosterID 
    AND e.EventID = ${eventId}
    LEFT JOIN ProfilePictures pp 
    ON pp.UserID = id`
    
    return result.recordset
}

async function GetEventImages(EventID)
{
    try{
        let result = await sql.query`SELECT * FROM EventsImages ei WHERE EventID = ${EventID}`
        return result.recordset
    }
    catch(err)
    {
        return{msg: 'Internal server error.', status: 500, err: err}
    }
}

async function getLastTwoEvents(lastEventId)
{
    let result = await sql.query(`
    SELECT DISTINCT
	e.EventName, 
	e.EventDescription, 
	e.EventHosterID, 
	e.EventType, 
	e.EventClass, 
	e.EventStartDate, 
	e.EventEndDate, 
	e.EventID, 
	e.EventLocation, 
	(SELECT 
		CASE 
			WHEN lve.EventType = e.EventClass
			THEN COUNT(*) * 5 
			ELSE COUNT(*) 
		END 
	FROM Analytics a 
        WHERE a.EventType = e.EventClass  
        AND a.UserID = 1005) AS EventOccurences
    FROM Events e
    LEFT JOIN LatestVisitedEvent lve 
        ON e.EventClass = lve.EventType 
    ORDER BY EventOccurences DESC
    OFFSET ${lastEventId} ROWS FETCH NEXT 2 ROWS ONLY`)
    return result.recordset
}
async function EditEvent(TargetEventID, CurrentUserToken, UdpatedEventName, 
    updatedEventCategory, updatedEventStartDate, updatedEventEndDate, updatedEventDesc, updatedEventType, updatedEventLocation )
    {
        let tokenData = validateToken(CurrentUserToken)
        if(tokenData.status == true)
        {
            let targetEvent = await getEventById(TargetEventID)
            if(Number(targetEvent[0].id) == Number(tokenData.userID))
            {            
                try{
                    await sql.query`UPDATE dbo.Events 
                    SET EventDescription = ${updatedEventDesc}, 
                    EventName = ${UdpatedEventName},
                    EventType = ${updatedEventType},
                    EventStartDate = ${updatedEventStartDate},
                    EventEndDate = ${updatedEventEndDate},
                    EventClass = ${updatedEventCategory},
                    EventLocation = ${updatedEventLocation}
                    WHERE EventHosterID = ${tokenData.userID} AND EventID = ${TargetEventID} `
                    return {status: 200, msg: 'Event successfully updated.'}
                }
                catch(err)
                {
                    console.log(err)
                    return {status: 409, msg: 'You can not do this action.'}
                }
            }
            else
            {
                return {status: 409, msg: 'You are not the owner of this event.'}
            }
        }
    }

async function GetAllUpcomingEvents()
{
    try{
        let result = await sql.query`SELECT * FROM Events e
        WHERE EventStartDate > GETDATE()`
        return {status: 200, msg: 'Events successfully fetched', data: result}
    }
    catch(err)
    {
        return {status: 500, msg: 'Internal Server Error'}
    }
}

async function GetAllUpcomingUserEvents(userID)
{
    try{
        let result = await sql.query`    
        SELECT * FROM Events e 
        JOIN dbo.AttendancesTable at3 
        ON at3.EventID = e.EventID 
        JOIN Users u 
        ON u.id = at3.UserID 
        WHERE e.EventStartDate > GETDATE()`
        return {status: 200, msg: 'Events successfully fetched', data: result}
    }
    catch(err)
    {
        console.log(err)
        return {status: 500, msg: 'Internal Server Error'}
    }
}

async function GetAllEventsHostedByUser(userID)
{
    try{
        let result = await sql.query`
        SELECT 
            EventName, 
            EventDescription,
            EventType,
            EventClass,
            EventID, 
            EventLocation, 
            EventStartDate, 
            EventEndDate, 
            Username, id as UserID
        FROM Events e
        JOIN Users u
            ON e.EventHosterID  = u.id
        WHERE u.id = ${userID}`
        return {status: 200, msg: 'Events successfully fetched.', data: result}
    }
    catch(err)
    {
        return {status: 500, msg: 'Internal Server Error'}
    }
}

async function GetAllAttendedUserEvents(userID)
{
    try{
        let result = await sql.query`
            SELECT 
            at2.UserID, 
            at2.EventID, 
            e.EventName, 
            e.EventDescription, 
            e.EventHosterID,
            e.EventType, 
            e.EventType, 
            e.EventClass, 
            e.EventStartDate,
            e.EventEndDate, 
            e.EventID,
            e.EventLocation 
        FROM AttendancesTable at2 
        JOIN dbo.Events e
            ON e.EventID = at2.EventID
        JOIN dbo.Users u
            ON u.id = ${userID}
        WHERE e.EventStartDate < GETDATE()`
        return {status: 200, msg: 'Events successfully retrieved.', data: result}
    }
    catch(err)
    {
        return {status: 500, msg: 'Internal Server Error'}
    }
}

async function UploadEventImages(UserID, EventID, EventImages)
{
    try{
        // check if event exists
        let eventExists = await getEventById(EventID)
        let eventOwnerID = eventExists[0].id
        // -- check if user is owner of the event
        if(Number(UserID) != Number(eventOwnerID))
        {
            throw new Error('This user is not the owner of the event.')
        }
        else
        {
            // --- insert the images to the event images table
            for(let EventImage of EventImages)
            {
                await sql.query`INSERT INTO dbo.EventsImages(EventID, EventImage) VALUES (${EventID}, ${EventImage})`
            }
            return {status: 200, msg: 'Event pictures successfully uploaded.'}

        }
    }
    catch(err)
    {
        return {status: 500, msg: 'Event pictures failed to upload.', err: err}
    }
}

module.exports = {
    HostEvent,
    CheckIfUserAlreadyCreatedEvent,
    DeleteEvent,
    AttendEvent,
    GetAllEvents,
    EditEvent,
    getEventById,
    DoesUserAttendEvent,
    GetAllUpcomingEvents,
    GetAllEventsHostedByUser,
    GetAllAttendedUserEvents,
    GetAllUpcomingUserEvents,
    getLastTwoEvents,
    UploadEventImages,
    GetEventImages
}