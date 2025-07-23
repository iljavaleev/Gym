import { VALIDATION } from "./validation";
import axios from "axios";

const getInitialQuery = () => 
    `http://localhost:8000/api/v1/user-next-training?date=${Date.now()}`


const formatGetDelTrainigUrl = (date) => 
    `http://localhost:8000/api/v1/user-training?date=${date}`

const POST_TRAINING_URL = "http://localhost:8000/api/v1/user-training";


const getTrainingByDate = async (url=formatGetDelTrainigUrl(), token) => {
    return await axios.get(
        url, 
        { headers: {"Authorization" : `Bearer ${token}`} });
};


const postTrainingByDate = async (payload, token) => {
    return await axios.post(
        POST_TRAINING_URL, 
        payload, 
        { headers: {"Authorization" : `Bearer ${token}`}});
}


const delTrainingByDate = async (date, token) => {
    await axios.delete(
        formatGetDelTrainigUrl(date), 
        { headers: {"Authorization" : `Bearer ${token}`}}
    );
}


const validateField = (field, obj) => {
    for (const validation of VALIDATION[field])
    {
        if (!validation.isValid(obj))
        {
            return validation.message;
        }
    }
    return null;
}


const dataHasErrors = (form) => 
{
    if (!form)
        return true;
    console.log(form);
    for (let i=0; i < form.length; i++)
    {
        let message = null;
        
        if (message=validateField("exercise", form[i].exercise)) 
        {  
            form[i].error = message;
            return true;
        }

        for (let sub_element of form[i].load)
        {
            if (message=validateField("reps", sub_element.reps)) 
            {
                form[i].error = message;
                return true;
            }    
            if (message=validateField("expect", sub_element.expect)) 
            {
                form[i].error = message;
                return true;
            }    
                
            if (message=validateField("fact", sub_element.fact)) 
            {
                form[i].error = message;
                return true;
            }
                
        };
        form[i].error = null;
    }
    return false;
}


export { delTrainingByDate, postTrainingByDate, getTrainingByDate, 
    getInitialQuery, dataHasErrors, formatGetDelTrainigUrl }