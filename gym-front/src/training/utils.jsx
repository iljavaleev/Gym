import { VALIDATION } from "./validation";

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


const showError = (element, message) => {
    document.querySelector("#" + element + "-error").classList.add("display-error");
    document.querySelector("#" + element + "-error").innerHTML = message;
}; 


const validateField = (field, obj) => {
    for (const validation of VALIDATION[field])
    {
        if (!validation.isValid(obj.value))
        {
            showError(obj.id, validation.message);
            return 1;
        }
    }
    return 0;
}


const dataFromForm = (event) => 
{
    let errors = [];
    const new_data = Array.from(event.target.getElementsByClassName("exercise")).map(element => {
        const exercise = {}
        const title = element.querySelector(".title");
        errors.push(validateField("title", title));
        exercise.title = title.value;

        exercise.load = Array.from(element.getElementsByClassName("load")).map(element => {
            const load = {};
            const reps = element.querySelector(".reps");
            errors.push(validateField("reps", reps));
            load.reps = reps.value;

            const expect = element.querySelector(".expect");
            errors.push(validateField("expect", expect));
            load.expect = expect.id;
            
            const fact = element.querySelector(".fact");
            errors.push(validateField("fact", fact));
            load.fact = fact.value;
            return load;
        });
       
        return exercise;
    });
    const sumWithInitial = errors.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
    );
    return [new_data, sumWithInitial ? true : false];
}


const getErrorFields = (form) =>
    Object.keys(form).reduce((acc, key) => {
    if (!VALIDATION[key]) return acc;

    const errorsPerField = VALIDATION[key]
        .map((validation) => ({
            isValid: validation.isValid(form[key]), // bool
            message: validation.message,
        }))
        // only keep the errors
        .filter((errorPerField) => !errorPerField.isValid);

    return { ...acc, [key]: errorsPerField };
    }, {});


export { delTrainingByDate, postTrainingByDate, getTrainingByDate, 
    getInitialQuery, dataFromForm, getErrorFields }