# OnSpot

This project is my high school finals project. It is a social media, networking platform with a main focus on events organisation. Users can sign up, make posts, leave replies, like comments and posts, message each other and follow each other, as well as share images, attend events, host events and manage their events' scheudle.

## Pages accessible to logged users
<ul>
    <li> <strong> Dynamic </strong> Home page (Includes peoples' posts and the user's contacts in the message box to the bottom-right side of the screen). </li>
    <li> <strong> Dynamic </strong> Profile pages for all users</li>
    <li> <strong> Dynamic </strong> Messenger page</li>
    <li> <strong> Dynamic </strong> Explore events page</li>
    <li> <strong> Dynamic </strong> Attended events page</li>
    <li> <strong> Dynamic </strong> Hosted events page</li>
    <li> <strong> Dynamic </strong> Upcoming events page</li>
    <li> <strong> Dynamic </strong> Notifications page</li>
    <li> Settings page</li>

</ul>

## Pages accessible to logged out users
<ul>
    <li>Log in page</li>
    <li>Register page</li>
</ul>

## Backend Structure
### The project's backend is a locally hosted Express server, that is utilizing MSSQL as a database.

#### Database structure
<ul>
    <li>Analytics Table</li>
    <li>Attendances Table</li>
    <li>Background Pictures Table</li>
    <li>Blocked Users Table</li>
    <li>Conversations Table</li>
    <li>Event Keywords Table</li>
    <li>Events Table</li>
    <li>Events Images Table</li>
    <li>Followers Table</li>
    <li>Keywords Table</li>
    <li>Latest Visited Event Table</li>
    <li>Messages Table</li>
    <li>Notifications Table</li>
    <li>Post Comments Table</li>
    <li>Post Images Table</li>
    <li>Post Likes Table</li>
    <li>Post Shares Table</li>
    <li>Posts Table</li>
    <li>Profile Pictures Table</li>
    <li>Users Table</li>
</ul>

#### Services
<ul>
    <li> Events Service </li>
    <li> User Service </li>
</ul>

## Messenger System
### The messenger system works, thanks to socket.io and the follow-unfollow system. 

<ul>
    <li> Upon sending a message, if the conversations between user A and user B doesn't exist in the database it is then created and then the message is sent. 
        <br> Thanks to Socket.io and a bit of DOM manipulation the messages sent are displayed in real-time, to the respective user. 
    </li>
</ul>

## Posts system

<ul>
    <li>All registered users can make, delete and edit their posts (the delete and edit functions are available to the owners only).</li>
    <li>All registered users can Like, Comment and Share any posts, including their own posts.</li>
    <li>All registered users can Like and Reply to each comment, on any post.</li>
    <li>The posts show the amount of likes and shares they have.</li>
</ul>

## Profile Page
### The profile page includes the following sub-categories
<ul>
    <li> Followers </li>
    <li> Following </li>
    <li> Latest Activity </li>
    <li> Write a post for the owners of the respective profile </li>
</ul>

#### Users can also change their profile pictures from their profile page. In addition to that, users can follow each other through their profile pages.

## Technology Stack 
<ul>
    <li>Bootstrap</li>
    <li>ReactJS</li>
    <li>JavaScript</li>
    <li>HTML, CSS, SCSS</li>
    <li>ExpressJS, NodeJS</li>
    <li>TypeScript</li>
    <li>MSSQL</li>
    <li>Socket.io</li>
    <li>Bcrypt</li>
</ul>
