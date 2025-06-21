const mock_data = [
    { 
        title: "отжимания",
        load: [
            {reps: 20, expect: 10, fact: null},
            {reps: 20, expect: 10, fact: null},
            {reps: 20, expect: 10, fact: null}
        ]
    }, 
    { 
        title: "приседания",
        load: [
            {reps: 30, expect: 20, fact: null},
            {reps: 30, expect: 20, fact: null},
            {reps: 30, expect: 20, fact: null}
        ]
    }
]


const getTrainingByDate = async (url) => {
    const result = "aaa";
    // const result = await axios(url);
    return new Promise((resolve, error) => {
            if (result)
                resolve({ data:  mock_data  }); // result.data
            else
                error(new Error());
        }
    );
}


const postTrainingByDate = async (url, payload) => {
    // let result = null;
    // try
    // {
    //     result = await axios.post(url, payload);
    // }
    // catch (error)
    // {
    //     console.error("failed to post data");
    // }
    
    // return new Promise((resolve, error) => {
    //         if (result)
    //             resolve();
    //         else
    //             error(new Error());
    //     }
    // );
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


const delTrainingByDate = async (url, date) => {
    const result = "aaa";
    // const result = await axios(url);
    return new Promise((resolve, error) => {
            if (result)
                resolve({ data:  []  }); // result.data
            else
                error(new Error());
        }
    );
}


const formatDateUrl = (date, user) =>  
    `http://localhost:8000/api/v1/search-by-date?user=${user}&date=${date}`;


const formatPostTraingUrl = (user) => 
    `http://localhost:8000/api/v1/user-training?user=${user}`;


const getInitialQuery = (id) => {
    if (id)
        return formatDateUrl(Date.now(), id);
    return "";
};

const dataFromForm = (event) => 
{
    const new_data = Array.from(event.target.getElementsByClassName("exercise")).map(element => {
        const exercise = {}
        exercise["title"] = element.querySelector(".title").value;
        exercise["load"] = Array.from(element.getElementsByClassName("load")).map(element => {
            const load = {};
            load["reps"] = element.querySelector(".reps").value;
            load["expect"] = element.querySelector(".expect").value;
            load["fact"] = element.querySelector(".fact").value;
            return load;
        });
       
        return exercise;
    });
    return new_data;
}

export {delTrainingByDate, postTrainingByDate, getTrainingByDate, getInitialQuery, dataFromForm }