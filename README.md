# OnSpot

This project is my high school finals project. It is a social media, networking platform with a main focus on events organisation. Users can sign up, make posts, leave replies, like comments and posts, message each other and follow each other, as well as share images, attend events, host events and manage their events' scheudle.



## Table of Contents

1. [The motivation behind the project](#The-motivation-behind-the-project)
2. [What I strived to achieve and learn through this project](#What-I-strived-to-achieve-and-learn-through-this-project)
3. [Project Features](#Project-Features)
4. [Tech Stack](#Tech-Stack)
5. [Project Architecture](#Project-Architecture)
6. [Project Structure](#Project-Structure)
7. [Improvement Areas](#Improvement-Areas)


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
### User Interactions
### Events Management

### Activity-based Events Recommendation Algorithm
This algorithm is based on the number of times that a user has visited a certain kind of event where the event type is relevant. Predetermined weight coefficients are assigned to different kinds of activities. 
For example, if a user has visited the event pages for multiple events of the same category in the past, then visiting an event page of the same category in the future will have a higher activity weight than visiting event pages of different categories.

The algorithm also considers events that the user has registered for and attended in the past. Thus, it is more likely that they will be recommended events of a similar nature in the future.

All of this is performed via the SQL query below:

```SQL
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
		AND a.UserID = ${userID}) AS EventOccurences
FROM Events e
LEFT JOIN LatestVisitedEvent lve 
	ON e.EventClass = lve.EventType 
WHERE NOT EXISTS (
	SELECT 1 
	FROM BlockedUsers bu 
	WHERE (bu.BlockedUserID = e.EventHosterID AND bu.BlockerUserID = ${userID}) 
	OR (bu.BlockedUserID = ${userID} AND bu.BlockerUserID = e.EventHosterID)
)
ORDER BY EventOccurences DESC 
OFFSET ${lastEventId} ROWS FETCH NEXT 2 ROWS ONLY`
```

Notice the offset at the end. The idea behind it is that a user is only shown two events based on their preferences, and the other events (if available) are shown only upon scrolling down. This is achieved by calling the ```GetLastTwoEvents``` API endpoint upon scrolling. Thus, the effect of an **infinite scroll** is achieved. 

### Levenshtein Distance for searching events by title
Levenshtein Distance is used to calculate the similarity between the search term entered by a user and the events' titles. Levenshtein Distance calculates the minimum number of operations needed to transform one string into another. An operation could be inserting, deleting, or replacing a letter. Lower scores indicate closer matches!

This is useful because the platform can estimate how close two words are to one another and find the best-matching event title to what the user used as a search term.

On the technical side, all inputs are converted to lowercase, so the algorithm is case-insensitive. The search results are ranked in ascending order by the Levenshtein distance score.

It is crucial to note that the time complexity of the algorithm is O(m×n). As such, it is incredibly computationally expensive when querying databases with millions, if not billions, of records. To mitigate this, the search could be scoped down to a certain subset of events that the algorithm has estimated the user may show interest in.

Another option is to replace the Levenshtein Distance approach and use real-time fetching of event titles that correspond to the user input. This could be done via N-grams. Additionally, caching solutions could be implemented via Redis for an additional performance boost.

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
#### The API
The API is a RESTful API with a total of 51 REST endpoints and 12 WebSocket endpoints related to the real-time features of the project.
The diagram below shows a high-level overview of how the API works.
<img width="1293" height="306" alt="Screenshot From 2026-08-16 09-02-05" src="https://github.com/user-attachments/assets/c98fc0ea-b49a-4ed4-bf09-006b51ceebdd" />

##### Security Considerations
Security measures were taken when building the project. 
For example, incoming data inputs are validated and sanitized before being processed; server-side sessions were implemented for authentication & authorization purposes, and the database contains user password hashes with a secret number of salt rounds.

The tables below describe all available API endpoints.

**NOTE:** The tables below were generated by AI.

#### Authentication & Session

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/login` | Authenticate user (email/password), creates JWT session token |
| `POST` | `/register` | Create new user account (validates username, password, email) |
| `GET` | `/logout` | Destroy user session and clear cookie |
| `GET` | `/isUserLoggedIn` | Check if user has active session |
| `GET` | `/getUserData` | Fetch authenticated user's profile data |

---

#### User Profiles

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/getUserDataById/:id` | Fetch a user's profile (respecting block restrictions) |
| `POST` | `/AddUserBio/:profileID` | Update user bio (max 120 characters) |
| `POST` | `/changePfp` | Upload new profile picture |
| `POST` | `/changeBackgroundPicture` | Upload new background picture |
| `POST` | `/updateUsername/:userID` | Update username (ownership required) |
| `POST` | `/updateEmail/:userID` | Update email (ownership required) |
| `POST` | `/updateBio/:userID` | Update bio (ownership required) |
| `DELETE` | `/deleteProfile/:id` | Permanently delete user profile |

---

#### User Interactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/followUser/:userToBeFollowedId` | Follow another user |
| `GET` | `/getUserFollowers/:id` | Get follower list for a user |
| `POST` | `/blockUser/:blockedUserID` | Block a user |
| `POST` | `/unblockUser/:blockedUserID` | Unblock a user |
| `GET` | `/getBlockedUsers` | Get current user's blocked users list |

---

#### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/hostEvent` | Create a new event (duplicate check enabled) |
| `DELETE` | `/deleteEvent/:userID/:eventId` | Delete an event (owner required) |
| `POST` | `/EditEvent/:eventID` | Update event details |
| `GET` | `/getEventById/:id` | Fetch single event by ID |
| `GET` | `/getAllEvents` | Fetch all events (personalized) |
| `GET` | `/GetAllUpcomingEvents` | Fetch all upcoming events |
| `GET` | `/GetAllEventsHostedByUser/:id` | Fetch events hosted by a user |
| `GET` | `/GetAllAttendedUserEvents/:id` | Fetch events a user attends |
| `GET` | `/GetAllUpcomingUserEvents/:id` | Fetch upcoming events for a user |
| `GET` | `/getNextTwoEvents/:lastEventId` | Infinite scroll: next 2 recommended events |
| `GET` | `/isUserEventOwner/:eventID` | Check event ownership |
| `GET` | `/GetAllEventAttendees/:EventHosterID/:EventID` | Get event attendees |
| `POST` | `/attendEvent/:eventId` | Register as attendee |
| `POST` | `/doesUserAttendEvent/:eventId` | Check attendance status |
| `GET` | `/GetAllSearchedEvents` | Fetch searchable events |

---

#### Event Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/addEventImages/:postID` | Upload up to 4 event images |
| `GET` | `/GetEventImages/:EventID` | Retrieve event images |

---

#### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/createPost` | Create post (up to 8 images) |
| `POST` | `/updatePost/:postID` | Update post content |
| `DELETE` | `/deletePost/:postID` | Delete post |
| `GET` | `/getUserPosts/:userID` | Get posts by user |
| `GET` | `/getPostComments/:postID` | Get post comments |
| `POST` | `/UploadPostImages/:PostID` | Upload post images |
| `GET` | `/GetUserEvents` | Get authenticated user's events |
| `GET` | `/GetUserAttendedEvents/:userID` | Get attended events by user |

---

#### Post Engagement

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/getTotalPostLikes/:PostID` | Get total likes on post |
| `GET` | `/hasUserLikedPost/:PostID` | Check if user liked post |
| `POST` | `/likePost/:PostID` | Toggle like on post |
| `GET` | `/getPostShares/:PostID` | Get total shares on post |
| `POST` | `/sharePost/:PostID` | Share a post |
| `GET` | `/getUserSharedPosts/:UserID` | Get posts shared by user |
| `DELETE` | `/deleteSharedPost/:PostID` | Remove shared post |

---

#### Messaging

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/sendMessage/:receiverID` | Send message (auto-create conversation) |
| `GET` | `/getConversationMessages/:receiverID` | Get messages in conversation |
| `GET` | `/getConversationByConversationID/:conversationID` | Get messages by conversation ID |
| `GET` | `/GetLatestConversationMessage/:ConversationID` | Get last message in conversation |
| `GET` | `/GetAllUserConversations` | Get all conversations for user |

---

#### User Preferences

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/saveUserPreference` | Save event type preference for recommendations |
| `GET` | `/GetUserPreferences` | Get user's saved preferences |

---

#### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/SaveNotifications` | Store notification (msg/post/follow/comment/like/share) |
| `GET` | `/GetUserNotifications` | Get all notifications for user |
| `POST` | `/MarkNotificationAsRead` | Mark single notification as read |
| `POST` | `/MarkAllNotificationsAsRead` | Mark all notifications as read |

---

#### WebSocket Events (Socket.IO)

| Event | Direction | Description |
|-------|-----------|-------------|
| `connection` | Server | Client connected via Socket.IO |
| `requestConvo` | Client → Server | Request conversation messages between two users |
| `getConvo` | Server → Client | Emit conversation messages to requesting client |
| `sendMessage` | Client → Server | Send real-time message (creates conversation if needed) |
| `newMessage` | Server → Client | Broadcast updated conversation messages |
| `notify` | Client → Server | Trigger real-time notification |
| `receiveMessageNotification` | Server → Client | Notify new message |
| `receivePostNotification` | Server → Client | Notify new post |
| `newFollowerNotification` | Server → Client | Notify new follower |
| `newCommentNotification` | Server → Client | Notify new comment |
| `newShareNotification` | Server → Client | Notify post share |
| `newLikeNotification` | Server → Client | Notify post like |
| `disconnect` | Server | Client disconnected |

---

#### Some API Considerations

- **Authentication**: All protected routes require valid `userToken` in session
- **Rate Limiting**: Consider adding rate limits for high-frequency endpoints
- **Error Handling**: Most endpoints return `500` on internal errors
- **Image Uploads**: Uses `multer` for multipart/form-data handling
- **Sessions**: Configured with 1-hour max age, `httpOnly=false`

### Database
The database consists of 20 tables separated into 4 different domains: Users, Events, Posts, and Analytics.

<img width="1451" height="609" alt="Screenshot From 2026-08-15 07-57-23" src="https://github.com/user-attachments/assets/73d2039d-37df-4c15-a300-0c0441614223" />


#### The Users Domain
This domain concerns tables related to everything that directly affects the user:
- Followers
- Block list
- Chats
- Notifications

#### The Events Domain
The events domain concerns all data related to the events:
- Keywords
- Images
- Organizer
- Name
- Location

#### The Posts Domain
This domain concerns all of the data related to a post:
- Post author
- Timestamp
- Attached images (if applicable)
- Comments
- Likes
- Shares

#### The Analytics Domain
The analytics domain concerns everything about a user's activity on the platform. The tables here are utilized to recommend relevant events to each user's feed. 

Data points of interest include:
- The latest event category that a user visited
- Searched event types
- Previously attended event categories


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

## Improvement Areas
