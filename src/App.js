import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import LandingPageComponent from './Components/LandingPageComponent/LandingPageComponent';
import ErrorPage from './Components/ErrorPageComponent/ErorPage';
import RegistrationPageComponent from './Components/RegistrationPageComponent/RegistrationPageComponent';
import LoginPageComponent from './Components/LoginPageComponent/LoginPageComponent';
import HostAnEventPageComponent from './Components/HostAnEventComponent/HostAnEventPageComponent';

function App() {
  return (
   <Router>
    <Routes>
      <Route path = '/' element={<LandingPageComponent/>}/>
      <Route path = '/register' element={<RegistrationPageComponent/>}/>
      <Route path = '/login' element={<LoginPageComponent/>}/>
      <Route path = '/HostEvent' element={<HostAnEventPageComponent/>}/>

      <Route path = '*' element={<ErrorPage/>}/>

    </Routes>
   </Router>
  );
}

export default App;
