import { getDirtyFields, getErrorFields } from '../utils/utils';
import { AuthField } from './components';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { VALIDATION } from './validation';
import { getToken } from './utils';
import { useCookies } from 'react-cookie'

const ENDPOINT = "http://localhost:8000/api/v1/register";

const INITIAL_STATE = {
    email: '',
    password1: '',
    password2: ''
};


const SignUpForm = () => { 
    const location = useLocation();
    const navigate = useNavigate();
    const [ cookies, setCookie ] = useCookies(["access_token", "user_id"]);
    const [form, setForm] = useState(INITIAL_STATE);

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
        if (hasErrors) return;
        
        try
        {
            const form_data = new FormData();
            form_data.append("username", form.email);
            form_data.append("password", form.password1);
            
            const {access_token, user_id, expire } = await getToken(ENDPOINT, form_data);

            setCookie("access_token", access_token, {expires: expire});            
            setCookie("user_id", user_id);
            navigate(location.state?.from?.pathname);
        }
        catch (error)
        {
            console.log(error)
            console.info("Failed to get token");
        }
        
        // navigate to home?
    };

    return (
        <div>
            <h2>Registration Form</h2>
            <form onSubmit={handleSubmit}>
                <AuthField 
                    id={"email"} 
                    value={form.email}  
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Адрес эл. почты
                </AuthField> 
                <AuthField 
                    id={"password1"} 
                    value={form.password1}  
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Пароль
                </AuthField> 
                <AuthField 
                    id={"password2"} 
                    value={form.password2}  
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Подтвердите пароль
                </AuthField> 
            <button type="submit" disabled={hasChanges}>Зарегестрироваться</button>
            </form>
        </div>
    );
};


export { SignUpForm };