
import { NoMatch } from '../components/components';
import { Generic } from '../generic/generic'
import { LoginForm } from '../auth/loginForm';
import { SignUpForm } from '../auth/signUpForm';
import { Training } from '../training/training'
import { Exercise } from '../exercise/exercise';
import { Routes, Route, Outlet, NavLink, useLocation, Navigate} from 'react-router';
import { useCookies } from "react-cookie";
import { useRef, useContext, useEffect, useState } from 'react';
import { getUserExs } from '../exercise/utils';
import './App.css'

import { UserDataContext } from './appContext';
import styled from 'styled-components';

const StyledContainer = styled.div`
  max-inline-size: 1080px;
  margin-inline: auto;
`;

const StyledNav = styled.ul`
  display: flex;
  gap: var(--gap-size);
  padding: 0.5rem;
  background-color: #d1ef0dff;
  border-radius: 15px;
  
  li {
    list-style-type: none;
  }

  li > a {
    display: block;
    background-color: #0c0b0bff;
    color: white;
    padding: 0.5em 1em;
    text-decoration: none;
    border-radius: 15px;
  };

  .nav-right {
    margin-inline-start: auto;
  }
`;


const ProtectedRoute = ({ children }) => {
    const [ cookies ] = useCookies();
    const location = useLocation();

    if (!cookies.access_token) 
    {
        return <Navigate to="/login" replace state={{from: location}}/>;
    }

    return children;
};

// const navigate = useNavigate();
// navigate("/users");

const App = () => {
  const [ cookies, updateCookies ] = useCookies();
  const [ userExs, setUserExs ] = useState([]);

  const handleLogout = () => {
      updateCookies("access_token", "");
  };

  const handleDataChange = (data) => { setUserExs(data); };

  useEffect(() => {
        (async () => {
            try
            {
                if (cookies.access_token)
                {
                    const userData = await getUserExs(cookies.access_token);
                    setUserExs(userData.data);
                }
            }
            catch (error)
            {
                console.log(error);
            }
        })();
  }, [cookies]);
  
  return (
   
      <Routes>
        <Route element={<Layout token={cookies.access_token} onLogout={handleLogout}/>}>
          <Route index element={<Generic />} />
          <Route path="my-training/*" element={
            <ProtectedRoute>
              <UserDataContext.Provider value={userExs}>
                <MyTraining onChange={handleDataChange}/>
              </UserDataContext.Provider>
            </ProtectedRoute>
          }/>
          <Route path="login" element={<LoginForm/>}/>
          <Route path="register" element={<SignUpForm/>}/>
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
   
  )
}

const MyTraining = ({onChange}) => {
  return (
    <>
      <Routes>
        <Route index element={ <Training/> }/>
        <Route path="exercise" element={ <Exercise onChange={onChange}/> }/>
      </Routes>
      
      <Outlet />
    </>
  );
};


const Layout = ( {token, onLogout} ) => {
  return (
     <StyledContainer>
      <nav>
        <StyledNav>
          <li><NavLink to="/" >Программа тренировок</NavLink></li>
          <li><NavLink to="/my-training" >Мои тренировки</NavLink></li>
          {!token && <li><NavLink className="nav-right" to="/login" >Вход</NavLink></li>}
          {!token && <li><NavLink className="nav-right" to="/register" >Регистрация</NavLink></li>}
          {token && <li><NavLink className="nav-right" to="/"onClick={onLogout}>Выйти</NavLink></li>}           
        </StyledNav>
      </nav>
      <main>
        <Outlet />
      </main>
     </StyledContainer>
  );
};

export default App
