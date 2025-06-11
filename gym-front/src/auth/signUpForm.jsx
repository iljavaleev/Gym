import { getDirtyFields, getErrorFields } from '../utils/utils';
import { AuthField } from './components';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';


import axios from 'axios';

const ENDPOINT = "http://localhost:8000/api/v1/register";


const asyncRegister = async (payload) => {
    let result = "res";
    // try
    // {
    //     result = await axios.post(ENDPOINT, payload);
    // }
    // catch (error)
    // {
    //     confirm.error(error);
    // }
    
    return new Promise((resolve, error) => {
            if (result)
                resolve();
            else
                error(new Error());
        }
    );
}


const INITIAL_STATE = {
    email: '',
    password1: '',
    password2: ''
};


const RESTRICTIONS = {
    email: [
        {
            isValid: (value) => !!value,
            message: 'Is required.',
        },
        {
            isValid: (value) => /\S+@\S+\.\S+/.test(value),
            message: 'Needs to be an email.',
        },
    ],
    password1: [
        {
            isValid: (value) => !!value,
            message: 'Is required.',
        },
    ],
    password2: [
        {
            isValid: (value) => !!value,
            message: 'Is required.'
        }
    ]
};


const SignUpForm = () => { 
    const location = useLocation();
    const navigate = useNavigate();

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
        errorFields = getErrorFields(form, RESTRICTIONS);
        const hasErrors = Object.values(errorFields).flat().length > 0;
        if (hasErrors) return;
        
        try
        {
            await asyncRegister({
                "email": form.email,
                "password": form.password1
            });
            navigate(location.state?.from?.pathname);
        }
        catch (error)
        {
            console.log(error)
            console.info("Failed to get token");
        }
        
        console.log("SUB");
        // navigate to home?
    };
    console.log(errorFields);
    return (
        <div>
            <h2>Registration Form</h2>
            <form onSubmit={handleSubmit}>
                <AuthField 
                    id={"email"} 
                    value={form.email}  
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Email
                </AuthField> 
                <AuthField 
                    id={"password1"} 
                    value={form.password1}  
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Password
                </AuthField> 
                <AuthField 
                    id={"password2"} 
                    value={form.password2}  
                    onChange={handleChange} 
                    errorFields={errorFields}>
                    Confirm Password
                </AuthField> 
            <button type="submit" disabled={hasChanges}>Submit</button>
            </form>
        </div>
    );
};


export { SignUpForm };