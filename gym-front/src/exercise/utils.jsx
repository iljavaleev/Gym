
import axios from "axios";

const mock_data = [
    { id: 1, title: "бегит"},
    { id: 2, title: 'пресс качат'},
    { id: 3, title: 'турник'},
    { id: 4, title: 'анжумания'}
]

const formatExUrl = (user) =>  
    `http://localhost:8000/api/v1/user-exercise?user=${user}`;


const getUserExs = async () => {

    // const result = await axios(formatExUrl(user));
    return new Promise((resolve, error) => {
            if (1)
                resolve({ data:  mock_data  }); // result.data
            else
                error(new Error());
        }
    );
};

const postUserEx = async (user, payload) => {
    // const result = await axios.post(formatPostTraingUrl(user), payload);
    return new Promise((resolve, error) => {
            if (payload)
            {
                console.log(payload);
                resolve();
            }
            else
                error(new Error());
        }
    );
}

export { getUserExs, postUserEx };