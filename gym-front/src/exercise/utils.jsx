
import axios from "axios";

const EXERCISE_URL = "http://localhost:8000/api/v1/user-exercise";

const formatDelExUrl = (id) =>
    `http://localhost:8000/api/v1/user-exercise?id=${id}`;


const getUserExs = async (token) => {
    return await axios.get(
        EXERCISE_URL, 
        { headers: {"Authorization" : `Bearer ${token}`} });
};


const postUserEx = async (payload, token) => {
    return await axios.post(
        EXERCISE_URL, 
        payload, 
        { headers: {"Authorization" : `Bearer ${token}`}});
}

const deleteUserEx = async (id, token) => {
    await axios.delete(
        formatDelExUrl(id), 
        { headers: {"Authorization" : `Bearer ${token}`}}
    );
}


export { getUserExs, postUserEx, deleteUserEx };