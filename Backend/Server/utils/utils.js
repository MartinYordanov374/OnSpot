
    const CREATE_DATABASE = `CREATE DATABASE OnSpot;`

    const CREATE_ATTENDANCES_TABLE_QUERY = `CREATE TABLE OnSpot.dbo.AttendancesTable (
        EventID int NULL,
        UserID int NOT NULL
        );`
    const CREATE_EVENT_KEYWORDS_TABLE_QUERY = `CREATE TABLE OnSpot.dbo.EventKeywordsTable (
            EventID int NOT NULL,
            KeywordID int NOT NULL
        );`
    
    const CREATE_MESSAGES_TABLE_QUERY = `CREATE TABLE OnSpot.dbo.Messages (
        ConvoID int NOT NULL,
        Message nvarchar(MAX) NOT NULL,
        SenderUserID int NOT NULL,
        DateSent datetime NOT NULL
    );`

    const CREATE_CONVERSATIONS_TABLE_QUERY = `CREATE TABLE OnSpot.dbo.Conversations (
        ConvoID int IDENTITY(0,1) NOT NULL,
        UserOneID int NOT NULL,
        UserTwoID int NOT NULL
    );`
    
    const CREATE_EVENT_TABLE_QUERY_QUERY = `CREATE TABLE OnSpot.dbo.Events (
            EventName nvarchar(250) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
            EventDescription nvarchar(250) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
            EventHosterID int NOT NULL,
            EventType int NOT NULL,
            EventClass nvarchar(250) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
            EventStartDate datetime NULL,
            EventID int IDENTITY(0,1) NOT NULL,
            EventLocation varchar(256) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
            EventEndDate datetime NULL
        );`
    
    const CREATE_FOLLOWERS_TABLE_QUERY =  `CREATE TABLE OnSpot.dbo.FollowersTable (
        FollowerUserID int NOT NULL,
        FollowedUserID int NOT NULL
    );`
    
    const CREATE_KEYWORDS_TABLE_QUERY = `CREATE TABLE OnSpot.dbo.KeywordsTable (
        keywordID int NOT NULL,
        keyword nvarchar(250) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL
    );`
    
    const CREATE_PROFILE_PICTURES_TABLE_QUERY = `CREATE TABLE OnSpot.dbo.ProfilePictures (
        UserID int NULL,
        ProfilePicture varbinary(MAX) NULL
    );`
    
    const CREATE_USERS_TABLE_QUERY = `CREATE TABLE OnSpot.dbo.Users (
        id int IDENTITY(1,1) NOT NULL,
        Email nvarchar(250) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
        Username nvarchar(250) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
        AttendeeCredits int DEFAULT 0 NULL,
        Followers int DEFAULT 0 NULL,
        HashedPassword nvarchar(250) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
        bio nvarchar(120) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
        CONSTRAINT PK__Users__3213E83F50BA5307 PRIMARY KEY (id)
    );`


module.exports = {
    CREATE_ATTENDANCES_TABLE_QUERY,
    CREATE_EVENT_KEYWORDS_TABLE_QUERY,
    CREATE_EVENT_TABLE_QUERY_QUERY,
    CREATE_FOLLOWERS_TABLE_QUERY,
    CREATE_KEYWORDS_TABLE_QUERY,
    CREATE_PROFILE_PICTURES_TABLE_QUERY,
    CREATE_USERS_TABLE_QUERY,
    CREATE_DATABASE,
    CREATE_CONVERSATIONS_TABLE_QUERY,
    CREATE_MESSAGES_TABLE_QUERY
}