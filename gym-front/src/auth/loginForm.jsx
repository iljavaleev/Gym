import { getDirtyFields, getErrorFields } from '../utils/utils';
import { AuthField } from './components';
import { useState } from 'react';
import { VALIDATION } from './validation';
import { useLocation, Link, useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';

import { submit } from './utils';
import styled from 'styled-components';

const StyledForm = styled.form`
    display: flex;
    gap: var(--gap-size);
    flex-direction: column;
    align-self: center;
    max-width: 30%;

    .toRegister
    {
       
        font-size: 0.8em;
    }
    
`;

const ENDPOINT = "http://localhost:8000/api/v1/login";

const INITIAL_STATE = {
    email: '',
    password: ''
};


const LoginForm = () => { 
    const [form, setForm] = useState(INITIAL_STATE);
    const [error, setError] = useState({submit_error:"", field_error: {}});
    const [ _, setCookie] = useCookies();
    const location = useLocation();
    const navigate = useNavigate();
    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value,
        });
        setError("");
    };
    
    const dirtyFields = getDirtyFields(form, INITIAL_STATE);
    const hasChanges  = Object.values(dirtyFields).every((isDirty) => !isDirty);
   
    const handleSubmit = async (event) => {
        event.preventDefault();
        const field_error = (getErrorFields(form, VALIDATION));
        setError({...error, field_error: field_error});
        const hasErrors = Object.values(field_error).flat().length > 0;
        
        if (hasErrors)
        {
            console.log(field_error);
            return;   
        };

        const result = await submit(form, error, setError, ENDPOINT);
        if (result)
        {
            const { access_token, user_id, expire } = result;
            setCookie("access_token", access_token, {expires: new Date(expire * 1000)});            
            setCookie("user_id", user_id);
            const origin = location.state?.from?.pathname || '/';
            navigate(origin);
        }
        
            
    }
    return (
        <div className="area">
            <h2>Авторизация</h2>
            <StyledForm onSubmit={handleSubmit}>
                <AuthField 
                    id={"email"} 
                    value={form.email}  
                    onChange={handleChange}> 
                    Адрес эл. почты:
                </AuthField>
                {error?.field_error?.email ? (
                <span style={{ color: 'red' }}>
                    {error?.field_error?.email[0]?.message}
                </span>):null} 
                <AuthField 
                    id={"password"} 
                    value={form.password} 
                    onChange={handleChange}>
                    Пароль:
                </AuthField>
                {error?.field_error?.password ? (
                <span style={{ color: 'red' }}>
                    {error?.field_error?.password[0]?.message}
                </span>):null}  
            <button type="submit" disabled={hasChanges}>Войти</button>
            
            <div className="toRegister">Еще нет аккаунта?<Link to="/register" replace state={{from: location}}> Зарегестрируйтесь</Link></div>
            </StyledForm>
            {error.submit_error}
        </div>
    );
};


export { LoginForm }; 