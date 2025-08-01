
import { NoMatch } from '../components/components';
import { Generic } from '../generic/generic'
import { LoginForm } from '../auth/loginForm';
import { SignUpForm } from '../auth/signUpForm';
import { Training } from '../training/training'
import { Exercise } from '../exercise/exercise';
import { Routes, Route, Outlet, NavLink, useLocation, Navigate} from 'react-router';
import { useCookies } from "react-cookie";
import './App.css'

const ProtectedRoute = ({ children }) => {
    const [ cookies ] = useCookies();
    const location = useLocation();

    if (!cookies.access_token) 
    {
        return <Navigate to="/login" replace state={{from: location}}/>;
    }

    return children;
};


const App = () => {
  const [ cookies, updateCookies ] = useCookies();
  
  const handleLogout = () => {
      updateCookies("access_token", "");
  };
  
  
  return (
    
    <Routes>
      <Route element={<Layout token={cookies.access_token} onLogout={handleLogout}/>}>
        <Route index element={<Generic />} />
        <Route path="login" element={<LoginForm />}/>
        <Route path="register" element={<SignUpForm/>}/>
        <Route path="my-training" element={<ProtectedRoute><Training /></ProtectedRoute>}/>
        <Route path="my-exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>}/>
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}

const Layout = ( {token, onLogout} ) => {
  const style = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
  });
  
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
        {!token && <NavLink to="/login" style={style}>Login</NavLink>}
        <span> ... </span>
        {!token && <NavLink to="/register" style={style}>Register</NavLink>}
        <span> ... </span>
        {token && (
            <button type="button" onClick={onLogout}>
              Sign Out
            </button>
        )}
        <span> ... </span>
        
        <NavLink to="/my-training" style={style}>MyTrainig</NavLink>
        <span> ... </span>
        
        <NavLink to="/my-exercise" style={style}>My exercise</NavLink>
      </nav>

      <main style={{ padding: "1rem 0" }}>
        <Outlet />
      </main>
    </>
  );
};

export default App
