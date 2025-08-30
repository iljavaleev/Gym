import { getDirtyFields, getErrorFields } from '../utils/utils';
import { AuthField } from './components';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';
import { VALIDATION } from './validation';
import { submit } from './utils';
import { StyledForm } from './styles';


const ENDPOINT = "http://localhost:8000/api/v1/register";


const INITIAL_STATE = {
    email: '',
    password: '',
    password2: ''
};


const SignUpForm = () => { 
    const [form, setForm] = useState(INITIAL_STATE);
    const [error, setError] = useState({submit_error:"", field_error: {}});
    const [cookie, setCookie] = useCookies();
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
            setCookie("access_token", access_token, {
                expires: new Date(expire * 1000)});            
            setCookie("user_id", user_id);
            navigate("/");
        }
            
    }
    
    return (
        <div className="area">
            <h2 className="in-label">Регистрация</h2>
            <StyledForm onSubmit={handleSubmit} >
                <AuthField 
                    id="email"
                    value={form.email}  
                    onChange={handleChange}> 
                    Адрес эл. почты:
                </AuthField>
                {error?.field_error?.email ? (
                <span style={{ color: 'red' }}>
                    {error?.field_error?.email[0]?.message}
                </span>):null} 
                <AuthField 
                    id="password"
                    value={form.password} 
                    onChange={handleChange}>
                    Пароль:
                </AuthField>
                {error?.field_error?.password ? (
                <span style={{ color: 'red' }}>
                    {error?.field_error?.password[0]?.message}
                </span>):null}  
                <AuthField 
                    id="password2" 
                    value={form.password2}  
                    onChange={handleChange} >
                    Подтвердите пароль:
                </AuthField>
                {error?.field_error?.password2 ? (
                <span style={{ color: 'red' }}>
                    {error?.field_error?.password2[0]?.message}
                </span>):null}   
            <button type="submit" disabled={hasChanges}>
                Зарегестрироваться
            </button>
            </StyledForm>
        </div>
    );
};


export { SignUpForm };
