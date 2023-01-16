import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import LandingPageComponent from './Components/LandingPageComponent/LandingPageComponent';
import ErrorPage from './Components/ErrorPageComponent/ErorPage';
import RegistrationPageComponent from './Components/RegistrationPageComponent/RegistrationPageComponent';
import LoginPageComponent from './Components/LoginPageComponent/LoginPageComponent';
import HostAnEventPageComponent from './Components/HostAnEventComponent/HostAnEventPageComponent';
import ExploreEventsComponent from './Components/ExploreEventsComponent/ExploreEventsComponent';
import EventPageComponent from './Components/EventPageComponent/EventPageComponent';
import ProfilePageComponent from './Components/ProfilePageComponent/ProfilePageComponent';
import EventsManagerComponent from './Components/EventsManagerComponent/EventsManagerComponent';
import CalendarScheduleAttendedEvents from './Components/CalendarScheduleComponent/CalendarScheduleAttendedEvents';
import CalendarScheduleHostedEvents from './Components/CalendarScheduleComponent/CalendarScheduleHostedEvent';
import CalendarScheduleUpcomingEvents from './Components/CalendarScheduleComponent/CalendarScheduleUpcomingEvents';
import MapComponent from './Components/MapComponent/MapComponent';
import HostAnEventPageComponentPaginated from './Components/HostAnEventComponent/HostAnEventPageComponentPaginated';
import EditEvent from './Components/EditEventComponent/EditEvent';
import UserFollowers from './Components/UserFollowersComponent/UserFollowers';

function App() {
  return (
   <Router>
    <Routes>
      <Route path = '/' element={<LandingPageComponent/>}/>
      <Route path = '/register' element={<RegistrationPageComponent/>}/>
      <Route path = '/login' element={<LoginPageComponent/>}/>
      <Route path = '/HostEvent' element={<HostAnEventPageComponent/>}/>
      <Route path = '/EditEvent/:id' element={<EditEvent/>}/>
      <Route path = '/UserFollowers/:id' element={<UserFollowers/>}/>

      <Route path = '/ExploreEvents' element={<ExploreEventsComponent/>}/>
      <Route path = '/Event/:eventId' element={<EventPageComponent/>}/> 
      <Route path = '/Profile/:id' element={<ProfilePageComponent/>}/> 
      <Route path = '/EventsManager' element={<EventsManagerComponent/>}/> 
      <Route path = '/EventsManager/CalendarSchedule/AttendedEvents' element={<CalendarScheduleAttendedEvents/>}/> 
      <Route path = '/EventsManager/CalendarSchedule/HostedEvents' element={<CalendarScheduleHostedEvents/>}/> 
      <Route path = '/EventsManager/CalendarSchedule/UpcomingEvents' element={<CalendarScheduleUpcomingEvents/>}/> 


      {/* TODO: ADD ID TO THE EVENT AND PROFILE ROUTES */}

      <Route path = '*' element={<LandingPageComponent/>}/>

    </Routes>
   </Router>
  );
}

export default App;
