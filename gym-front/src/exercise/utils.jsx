
import axios from "axios";

const mock_data = [
    { id: 1, title: "бегит"},
    { id: 2, title: 'пресс качат'},
    { id: 3, title: 'турник'},
    { id: 4, title: 'анжумания'}
]

const formatExUrl = (user) =>  
    `http://localhost:8000/api/v1/user-exercise`;

const formatDelExUrl = (user, id) =>
    `http://localhost:8000/api/v1/user-exercise?ex=${id}`;


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

const postUserEx = async (payload) => {
    // const result = await axios.post(formatExUrl(user), payload);
    return new Promise((resolve, error) => {
            const id = 33;
            if (payload)
            {
                console.log(payload);
                resolve(id);
            }
            else
                error(new Error());
        }
    );
}

const deleteUserEx = async (payload) => {
    // const result = await axios.delete(formatDelExUrl(user), payload);
    return new Promise((resolve, error) => {
            if (payload)
            {
                resolve(payload);
            }
            else
                error(new Error());
        }
    );
}


export { getUserExs, postUserEx, deleteUserEx };