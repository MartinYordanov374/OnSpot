# OnSpot

This project is my high school finals project. It is a social media, networking platform with a main focus on events organisation. Users can sign up, make posts, leave replies, like comments and posts, message each other and follow each other, as well as share images, attend events, host events and manage their events' scheudle.



## Table of Contents

1. [The motivation behind the project](#The-motivation-behind-the-project)
2. [What I strived to achieve and learn through this project](#What-I-strived-to-achieve-and-learn-through-this-project)
3. [Project Features](#Project-Features)
4. [Tech Stack](#Tech-Stack)
5. [Project Architecture](#Project-Architecture)
6. [Project Structure](#Project-Structure)
8. [Getting Started](#Getting-Started)
9. [Future Works](#Future-Works)


## Tech Stack

**Frontend:**  
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/css-%23663399.svg?style=for-the-badge&logo=css&logoColor=white)
![Sass](https://img.shields.io/badge/sass-%23CC6699.svg?style=for-the-badge&logo=sass&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white)

**Backend:**  
![NodeJS](https://img.shields.io/badge/node.js-%236DA55F.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/socket.io-%23010101.svg?style=for-the-badge&logo=socket.io&logoColor=white)

![Bcrypt](https://img.shields.io/badge/Bcrypt-003B57?logo=bcrypt&logoColor=white)

**Database:**  
![MSSQL](https://img.shields.io/badge/MSSQL-CC2927?logo=microsoftsqlserver&logoColor=white)


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

