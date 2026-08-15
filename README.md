# OnSpot

This project is my high school finals project. It is a social media, networking platform with a main focus on events organisation. Users can sign up, make posts, leave replies, like comments and posts, message each other and follow each other, as well as share images, attend events, host events and manage their events' scheudle.



## Table of Contents

1. [The motivation behind the project](#The-motivation-behind-the-project)
2. [What I strived to achieve and learn through this project](#What-I-strived-to-achieve-and-learn-through-this-project)
3. [Project Features](#Project-Features)
4. [Tech Stack](#Tech-Stack)
5. [Project Architecture](#Project-Architecture)
6. [Project Structure](#Project-Structure)
7. [Future Works](#Future-Works)


## The motivation behind the project
By the time I got to work on this project, the idea of a social networking platform had been in my mind for quite a while. 

Throughout high school I was captivated by the engineering that goes beyond a modern social media platform. In particular, **I was interested in how modern feed algorithms work.** How is it that two users on the same platform could see vastly different content? This project was the perfect opportunity for me to investigate that phenomenon. Looking back on the finished project, **I am proud of how well the activity-based recommendations turned out without the use of any machine learning algorithms.** I would even say that this is the biggest achievement of the project.

## What I strived to achieve and learn through this project
Through this project, I applied what I learned during my first **internship at Tieto** (at the time, MentorMate), my high school degree in *Applied Programming*, and online courses in Software Engineering.

Namely: full-stack web development, relational database normalization, complex SQL Queries, and computer networking.

As for the goals of the project, I wanted to have a social media web platform project on my resume with relevant features described in the [project features section.](#Project-Features) I also wanted to get an excellent grade for my high school final project(which I did).

Moreover, the **2023 National Tournament of Information Technology** hosted by Veliko Tarnovo University was approaching, and I wanted to have a strong project to compete with. I ended up getting **first place in the "Internet Applications" category!**

<a href='https://www.linkedin.com/in/martinyordanov374/overlay/Honor/117646437/treasury/?profileId=ACoAADc27CYBioWXgSqSD5HGy22Q-MIRy-eYzm4'>Click to see the certificate!</a>

## Project Features

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

## Project Architecture
### Frontend
### Backend
### Database
<img width="1451" height="609" alt="Screenshot From 2026-08-15 07-57-23" src="https://github.com/user-attachments/assets/73d2039d-37df-4c15-a300-0c0441614223" />


## Project Structure

The project is split into two main directories: `backend/` and `Components/` (inside `src/`).

### Backend (`/backend`)
- **Server code** - Express application setup
- **Services** - User and event operations (CRUD)
- **MSSQL Configuration** - Database connection setup
- **Validations** - Password complexity, username uniqueness, and email validation logic
- **Utils** - SQL queries used for database and tables initialization

### Frontend (`/src`)
- **Components** - React class components with lifecycle methods
- **Styles** - SCSS files for each component

```
.
├── Backend
│   ├── ReccommendationAlgorithm_KNN
│   │   └── KNN_Classifier.js
│   └── Server
│       ├── MSSQL Configuration
│       │   └── MSSQL-Configuration.js
│       ├── MockServer.js
│       ├── Services
│       │   ├── EventsService
│       │   │   └── EventsService.js
│       │   └── UserService
│       │       └── UserService.js
│       ├── Validations.js
│       ├── uploads
│       │   ├── 041d89185c355e21b77e32c13a1a3273
│       │   ├── 1932b5e42ae4354002d108d372262b85
│       │   ├── 3a5a92ad6e38a0ad3b4c5c0aee5046ad
│       │   ├── 44ac273cae3520b9e257b0eaf1a728c3
│       │   ├── 493420ee9c4f8fec84b24b693b2b47ef
│       │   ├── 7823f4a87835e8ed7a9ba64631911cbd
│       │   ├── 81f330f260d82bd59efded02505120aa
│       │   ├── 8704a406f9975e23a4b4ddcfaed83b6f
│       │   ├── 8cb3dfce344f4dae8d80a5af7f6c8071
│       │   ├── 9e3dad67861a2aa3672e7dbb6da200e4
│       │   ├── a8f0e7fcaea644deb1d71e999eb40098
│       │   ├── a9669cd13188e94586894c27f9d16cdd
│       │   ├── adf51bdb182f4337714b04cb8cd7ebc9
│       │   ├── c1538ac8ca07560dd5bcb3fabf5deee4
│       │   ├── e7765eaaed5c71caee6aa336e6a2d34c
│       │   └── fd9c5e80b1830fe8950cc06658ebcc26
│       └── utils
│           └── utils.js
├── README.md
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── Components
    │   ├── CalendarScheduleComponent
    │   │   ├── CalendarScheduleAttendedEvents.js
    │   │   ├── CalendarScheduleHostedEvent.js
    │   │   ├── CalendarScheduleUpcomingEvents.js
    │   │   └── Styles
    │   │       ├── CalendarScheduleStyle.css
    │   │       ├── CalendarScheduleStyle.css.map
    │   │       └── CalendarScheduleStyle.scss
    │   ├── ChatboxModalComponent
    │   │   ├── ChatBoxModalComponent.js
    │   │   └── Styles
    │   │       ├── ChatboxModal.css
    │   │       ├── ChatboxModal.css.map
    │   │       └── ChatboxModal.scss
    │   ├── DeleteEventModal
    │   │   ├── DeleteEventModal.js
    │   │   └── Styles
    │   │       ├── DeleteEventModal.css
    │   │       ├── DeleteEventModal.css.map
    │   │       └── DeleteEventModal.scss
    │   ├── EditEventComponent
    │   │   ├── EditEvent.js
    │   │   └── Styles
    │   │       ├── EditEventStyle.css
    │   │       ├── EditEventStyle.css.map
    │   │       └── EditEventStyle.scss
    │   ├── ErrorPageComponent
    │   │   └── ErorPage.js
    │   ├── EventCardComponent
    │   │   ├── EventCardComponent.js
    │   │   └── EventCardStyles
    │   │       ├── EventCard.css
    │   │       ├── EventCard.css.map
    │   │       └── EventCard.scss
    │   ├── EventPageComponent
    │   │   ├── EventPageComponent.js
    │   │   └── EventPageStyles
    │   │       ├── EventPageStyling.css
    │   │       ├── EventPageStyling.css.map
    │   │       └── EventPageStyling.scss
    │   ├── EventsManagerComponent
    │   │   ├── EventsManagerComponent.js
    │   │   ├── Styles
    │   │   │   ├── UpcomingEventsStyles.css
    │   │   │   ├── UpcomingEventsStyles.css.map
    │   │   │   └── UpcomingEventsStyles.scss
    │   │   └── UpcomingEventsComponent.js
    │   ├── ExploreEventsComponent
    │   │   ├── ExploreEventsComponent.js
    │   │   └── ExploreEventsStyles
    │   │       ├── ExploreEventsStyle.css
    │   │       ├── ExploreEventsStyle.css.map
    │   │       └── ExploreEventsStyle.scss
    │   ├── FollowersModalComponent
    │   │   ├── FollowersModalComponent.js
    │   │   └── FollowersModalStyles
    │   │       ├── FollowersModalStyling.css
    │   │       ├── FollowersModalStyling.css.map
    │   │       └── FollowersModalStyling.scss
    │   ├── HostAnEventComponent
    │   │   ├── HostAnEventPageComponent.js
    │   │   ├── HostAnEventPageComponentPaginated.js
    │   │   └── HostAnEventPageStyles
    │   │       ├── HostAnEventComponentStyles.css
    │   │       ├── HostAnEventComponentStyles.css.map
    │   │       └── HostAnEventComponentStyles.scss
    │   ├── ImagesModalComponent
    │   │   ├── PostImagesModalComponent.js
    │   │   └── Styles
    │   │       ├── PostImagesModalStyles.css
    │   │       ├── PostImagesModalStyles.css.map
    │   │       └── PostImagesModalStyles.scss
    │   ├── LandingPageComponent
    │   │   ├── LandingPageComponent.js
    │   │   ├── LandingPageStyles
    │   │   │   ├── LandingPage.css
    │   │   │   ├── LandingPage.css.map
    │   │   │   └── LandingPage.scss
    │   │   ├── NonRegisteredLandingPage.js
    │   │   └── RegisteredLandingPage.js
    │   ├── LoginPageComponent
    │   │   ├── LoginPageComponent.js
    │   │   └── LoginPageStyles
    │   │       ├── LoginPageStyles.css
    │   │       ├── LoginPageStyles.css.map
    │   │       └── LoginPageStyles.scss
    │   ├── MakePostComponent
    │   │   └── MakePostComponent.js
    │   ├── MapComponent
    │   │   ├── MapComponent.js
    │   │   └── MapComponentStyles
    │   │       ├── MapComponent.css
    │   │       ├── MapComponent.css.map
    │   │       └── MapComponent.scss
    │   ├── MessagesComponent
    │   │   ├── MessagesComponent.js
    │   │   └── Styles
    │   │       ├── MessagesStyles.css
    │   │       ├── MessagesStyles.css.map
    │   │       └── MessagesStyles.scss
    │   ├── MessagesSideMenu
    │   │   ├── MessagesSideMenu.js
    │   │   └── Styles
    │   │       ├── MessagesStyles.css
    │   │       ├── MessagesStyles.css.map
    │   │       └── MessagesStyles.scss
    │   ├── NavbarComponent
    │   │   ├── NavbarComponentNotRegisteredUser.js
    │   │   ├── NavbarComponentRegisteredUser.js
    │   │   ├── NavbarStyles.css
    │   │   ├── NavbarStyles.css.map
    │   │   └── NavbarStyles.scss
    │   ├── NotificationsPage
    │   │   ├── NotificationsPage.js
    │   │   └── Style
    │   │       ├── NotificationsPage.css
    │   │       ├── NotificationsPage.css.map
    │   │       └── NotificationsPage.scss
    │   ├── PostCommentComponent
    │   │   ├── PostCommenComponentt.js
    │   │   └── PostCommentStyles
    │   │       ├── Styles.css
    │   │       ├── Styles.css.map
    │   │       └── Styles.scss
    │   ├── PostComponent
    │   │   ├── PostComponent.js
    │   │   └── Styles
    │   │       ├── PostStyles.css
    │   │       ├── PostStyles.css.map
    │   │       └── PostStyles.scss
    │   ├── ProfilePageComponent
    │   │   ├── ProfilePageActivitySection.js
    │   │   ├── ProfilePageComponent.js
    │   │   └── ProfilePageStyles
    │   │       ├── ProfilePageStyle.css
    │   │       ├── ProfilePageStyle.css.map
    │   │       └── ProfilePageStyle.scss
    │   ├── RegistrationPageComponent
    │   │   ├── RegistrationPageComponent.js
    │   │   └── RegistrationPageStyles
    │   │       ├── RegistrationPageStyles.css
    │   │       ├── RegistrationPageStyles.css.map
    │   │       └── RegistrationPageStyles.scss
    │   ├── SettingsComponent
    │   │   ├── Settings.js
    │   │   └── Styles
    │   │       ├── SettingsStyles.css
    │   │       ├── SettingsStyles.css.map
    │   │       └── SettingsStyles.scss
    │   ├── SidebarComponent
    │   │   ├── SidebarComponent.js
    │   │   └── SidebarStyling
    │   │       ├── SidebarStyle.css
    │   │       ├── SidebarStyle.css.map
    │   │       └── SidebarStyle.scss
    │   ├── SquareEventCardComponent
    │   │   ├── SquareEventCardComponent.js
    │   │   └── Styles
    │   │       ├── SquareEventCardStyles.css
    │   │       ├── SquareEventCardStyles.css.map
    │   │       └── SquareEventCardStyles.scss
    │   └── UserFollowersComponent
    │       ├── Styles
    │       │   ├── UserFollowers.css
    │       │   ├── UserFollowers.css.map
    │       │   └── UserFollowers.scss
    │       └── UserFollowers.js
    ├── Images
    │   ├── conversation.png
    │   └── location-pin-solid.svg
    ├── KeyWordSimilarityAlgorithm
    │   ├── KeywordSimilarity.js
    │   └── LevenshteinDistance.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── reportWebVitals.js
    └── setupTests.js
```
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

