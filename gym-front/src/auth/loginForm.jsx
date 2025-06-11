import { getDirtyFields, getErrorFields } from '../utils/utils';
import { AuthField } from './components';
import { useState } from 'react';
import { useCookies } from 'react-cookie'
import { useLocation, Link } from 'react-router';

import axios from 'axios';

const ENDPOINT = "http://localhost:8000/api/v1/login";


const getToken = async (payload) => {
  
    const result = await axios.post(ENDPOINT, payload);
    
    return new Promise((resolve, error) => {
            if (result)
                resolve({ data: { token: result.token, user_id: result.user_id } });
            else
                error(new Error());
        }
    );
}


const INITIAL_STATE = {
    email: '',
    password: ''
};


const RESTRICTIONS = {
    email: [
        {
            isValid: (value) => !!value,
            message: 'Is required',
        },
        {
            isValid: (value) => /\S+@\S+\.\S+/.test(value),
            message: 'Needs to be an email',
        }
    ],
    password: [
        {
            isValid: (value) => !!value,
            message: 'Is required',
        }
    ]
};


const LoginForm = () => { 
    const [form, setForm] = useState(INITIAL_STATE);
    const [ cookies, setCookie ] = useCookies(["access_token", "user_id"]);
    const location = useLocation();
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

        errorFields = getErrorFields(form, RESTRICTIONS);
        const hasErrors = Object.values(errorFields).flat().length > 0;
        if (hasErrors) return;
        
        try
        {
            const [token, user_id] = await getToken({
                "email": form.email,
                "password": form.password
            });
            setCookie("access_token", token);
            setCookie("user_id", user_id);
        }
        catch (error)
        {
            console.info("Failed to get token");
        }

        // navigate to home?
    };
    
    
    console.log(errorFields);

    return (
        <div>
            <h2>Log in Form</h2>
            <form onSubmit={handleSubmit}>
                <AuthField 
                    id={"email"} 
                    value={form.email}  
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Email
                </AuthField> 
                <AuthField 
                    id={"password"} 
                    value={form.password} 
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Password
                </AuthField> 
            <button type="submit" disabled={hasChanges}>Submit</button>
            <span>Еще нет аккаунта?<Link to="/register" replace state={{from: location}}>Зарегестрируйтесь</Link></span>
            </form>
        </div>
    );
};


export { LoginForm }; 