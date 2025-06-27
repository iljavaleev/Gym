import { getDirtyFields, getErrorFields, parseJwt } from '../utils/utils';
import { AuthField } from './components';
import { useState } from 'react';
import { useCookies } from 'react-cookie'
import { useLocation, Link, useNavigate } from 'react-router';
import { VALIDATION } from './validation';
import { getToken } from './utils';

const ENDPOINT = "http://localhost:8000/api/v1/login";



const INITIAL_STATE = {
    email: '',
    password: ''
};


const LoginForm = () => { 
    const [form, setForm] = useState(INITIAL_STATE);
    const [ cookies, setCookie ] = useCookies(["access_token", "user_id"]);
    const location = useLocation();
    const navigate = useNavigate();
    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value,
        });
    };
    
    const dirtyFields = getDirtyFields(form, INITIAL_STATE);
    const hasChanges  = Object.values(dirtyFields).every((isDirty) => !isDirty);

    let errorFields = {};
    const handleSubmit = async (event) => {
        event.preventDefault();
        errorFields = getErrorFields(form, VALIDATION);
        const hasErrors = Object.values(errorFields).flat().length > 0;
        if (hasErrors)
        {
            console.log(errorFields);
            return;   
        };
        
        try
        {
            const form_data = new FormData();
            form_data.append("username", form.email);
            form_data.append("password", form.password);
            
            const {access_token, user_id, expire} = await getToken(ENDPOINT, form_data);

            setCookie("access_token", access_token, {expires: expire});            
            setCookie("user_id", user_id);
        }
        catch (error)
        {
            console.log(error)
            console.info("Failed to get token");
        }
        navigate("/");
    };
    
    
    return (
        <div>
            <h2>Log in Form</h2>
            <form onSubmit={handleSubmit}>
                <AuthField 
                    id={"email"} 
                    value={form.email}  
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Адрес эл. почты
                </AuthField> 
                <AuthField 
                    id={"password"} 
                    value={form.password} 
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Пароль
                </AuthField> 
            <button type="submit" disabled={hasChanges}>Войти</button>
            <span>Еще нет аккаунта?<Link to="/register" replace state={{from: location}}>Зарегестрируйтесь</Link></span>
            </form>
        </div>
    );
};


export { LoginForm }; 