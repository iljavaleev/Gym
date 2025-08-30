import { parseJwt } from '../utils/utils';

import { HttpStatusCode } from 'axios';
import axios from 'axios';

const getToken = async (url, form_data) => {
    let result = {};
    try
    {
        result = await axios.post(url, form_data);
        
    }
    catch (error)
    {
        return {
            status: error.response?.status,
            message: error.response?.data?.detail
        }
    }
    const decoded = parseJwt(result.data.access_token);
    return { access_token: result.data.access_token, 
        user_id: decoded.user_id, expire: decoded.exp }
    
}

const submit = async (form, error, setError, url) => {
   
    try
    {
        const form_data = new FormData();
        form_data.append("username", form.email);
        form_data.append("password", form.password);
        const result = await getToken(url, form_data);
        if (result.access_token)
        {
            return result;
        }
        else if (result.status == HttpStatusCode.Unauthorized)
        {
            setError({ ...error, submit_error: result.message});
            return;
        }
        else
            throw new Error();
    }
    catch (error)
    {
        console.log(error)
        console.info("Failed to get token");
        setError({ ...error, submit_error: "Auth error"})
    }    
};

export { submit };