import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import LandingPageComponent from './Components/LandingPageComponent/LandingPageComponent';
import ErrorPage from './Components/ErrorPageComponent/ErorPage';

function App() {
  return (
   <Router>
    <Routes>
      <Route path = '/' element={<LandingPageComponent/>}/>
      <Route path = '*' element={<ErrorPage/>}/>

    </Routes>
   </Router>
  );
}

export default App;
