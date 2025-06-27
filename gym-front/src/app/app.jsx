import { useState } from 'react'
import { NoMatch } from '../components/components';
import { Generic } from '../generic/generic'
import { LoginForm } from '../auth/loginForm';
import { SignUpForm } from '../auth/signUpForm';
import { Training } from '../training/training'
import { Exercise } from '../exercise/exercise';
import { Routes, Route, Outlet, NavLink } from 'react-router';
import { useCookies } from 'react-cookie';
import './App.css'





const App = () => {
  
  return (
    <>
      <Routes>
        <Route element={<Layout/>}>
          <Route index element={<Generic />} />
          <Route path="login" element={<LoginForm />}/>
          <Route path="register" element={<SignUpForm />}/>
          <Route path="my-training" element={<Training /> }/>
          <Route path="my-exercise" element={<Exercise /> }/>
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </>
  )
}

const Layout = () => {
  const style = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
  });
  const [ cookies ] = useCookies();
  console.log(cookies);
  return (
    <>
      <h1>React Router</h1>

      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <NavLink to="/" style={style}>Home</NavLink>
        <span> ... </span>
        <NavLink to="/login" style={style}>Login</NavLink>
        <span> ... </span>
        <NavLink to="/register" style={style}>Register</NavLink>
        <span> ... </span>
        { cookies.access_token &&
          <NavLink to="/my-training" style={style}>MyTrainig</NavLink>}
        <span> ... </span>
        { cookies.access_token &&
        <NavLink to="/my-exercise" style={style}>My exercise</NavLink>}
      </nav>

      <main style={{ padding: "1rem 0" }}>
        <Outlet />
      </main>
    </>
  );
};

export default App
