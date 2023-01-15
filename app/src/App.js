import './App.css';
import { lazy, Suspense, useState, useEffect } from 'react';
import {AppBar, Input} from './components';
import 
{ 
  BrowserRouter as Router, 
  Routes, 
  Route 
} from 'react-router-dom';
import Loading from './pages/Loading';

const Login = lazy(() => import ('./pages/Login'));
const Register = lazy(() => import ('./pages/Register'));
const Document = lazy(() => import ('./pages/Document'));
const Documents = lazy(() => import ('./pages/Documents'));



function App() {
  const [currentRoute, setCurrentRoute] = useState('/')
  console.log (currentRoute)

  return (
   <Router>
    { currentRoute !== '/login' && currentRoute !== '/register' ? <AppBar/> : "" }

      <Suspense fallback= {<Loading/>}>
        <Routes>
          <Route path="/" element={<Documents setCurrentRoute={setCurrentRoute}/>}/>
          <Route path="/documents" element={<Documents setCurrentRoute={setCurrentRoute}/>}/>
          <Route path="/document/:id" element={<Document setCurrentRoute={setCurrentRoute}/> }/>
          <Route path="/login" element={<Login setCurrentRoute={setCurrentRoute}/> }/>
          <Route path="/register" element={ <Register setCurrentRoute={setCurrentRoute}/>}/>
        </Routes>
      </Suspense>
    
   </Router>
  );
}

export default App;
