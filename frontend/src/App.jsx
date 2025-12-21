import {BrowserRouter,Routes,Route} from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About';
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'


function App() {
  return (
    <BrowserRouter>
    <div className="flex justify-around pt-4 text-3xl font-bold">
        <h1>Mern Blog Project</h1>
      </div>
    <Routes>
      <Route path="/"  element={<Home/>} />
      <Route path="/about"  element={<About/>} />
      <Route path="/dashboard"  element={<Dashboard/>} />
      <Route path="/sign-in"  element={<SignIn/>} />
      <Route path="/sign-up"  element={<SignUp/>} />
    </Routes>
    </BrowserRouter>
    
  );
}

export default App;
