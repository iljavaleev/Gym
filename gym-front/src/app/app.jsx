import { useState } from 'react'
import { NoMatch } from '../components/components';
import { Generic } from '../generic/generic'
import { LoginForm } from '../auth/loginForm';
import { SignUpForm } from '../auth/signUpForm';
import { Training } from '../training/training'
import { Exercise } from '../exercise/exercise';
import { Routes, Route, Link, Outlet, useParams } from 'react-router';
import './App.css'


const App = () => {
  
  return (
    <>
      <h1>Start</h1>
      <div>
        <nav>
              <Link to="/">Home</Link>...
              <Link to="/login">Login</Link>...
              <Link to="/register">Register</Link>...
              <Link to="/my-training">MyTrainig</Link>
              <Link to="/my-exercise">My exercise</Link>
        </nav>
        <Routes>
            <Route index element={<Generic />} />
            <Route path="login" element={<LoginForm/ >}/>
            <Route path="register" element={<SignUpForm/ >}/>
            <Route path="my-training" element={<Training /> }/>
            <Route path="my-exercise" element={<Exercise /> }/>
            <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </>
  )
}



export default App
