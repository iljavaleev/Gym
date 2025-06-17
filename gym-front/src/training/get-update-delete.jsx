import { useState, useReducer, useEffect, useCallback, useRef } from 'react';
import { Button, DateTimeForm } from '../components/components';
import { useCookies } from 'react-cookie'
import { TrainingFormList } from './components';


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

const to_add_ex = {
    title: "",
    load: [
        {reps: null, expect: null, fact: null}
    ]
};

const to_add_set = {reps: null, expect: null, fact: null};

const formatUrl = (date, user) =>  
    `http://192.168.1.159:8000/api/v1/search-by-date?user=${user}&date=${date}`;

const get_initial_query = (id) => {
    if (id)
        return formatUrl(Date.now(), id);
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


const trainingReducer = (state, action) => {
    switch (action.type) 
    {
        case 'TRAINING_FETCH_INIT':
            return { ...state, isLoading: true, isError: false };
        case 'TRAINING_FETCH_SUCCESS':
            return { ...state, 
                data: action.payload, 
                isLoading: false, 
                isError: false };
        case 'TRAINING_FETCH_FAILURE':
            return { ...state, isLoading: false, isError: true };
        case 'TRAINING_UPDATE':
            return { ...state, 
                data: action.payload, 
                isLoading: false, 
                isError: false,
                isCruError: false 
            }
        case 'TRAINING_CRU_FAILURE':
            return { ...state, isCruError: true };
        case 'TRAINING_ADD':
            state.data.push(to_add_ex);
            return { ...state,
                data: state.data
            };
        case 'TRAINING_DEL':
            if (state.data.length > 0)
                state.data.pop();
            return { ...state };
        case 'SET_DEL':
            if (state.data[action.idx].load.length > 0)
                state.data[action.idx].load.pop();
            return { ...state };
        case 'SET_ADD':
            state.data[action.idx].load.push(to_add_set);
            return { ...state };
        default:
            throw new Error();
    }
};
// array.splice(index, 1)

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

const GetUpdateDeleteTraining = () => {
    const [ cookies, setCookie ] = useCookies();
    
    // date
    const [ trainingDate, setTrainigDate ] = useState(null);

    // training data
    const [ training, dispatchTraining ] = useReducer(
        trainingReducer, {
            data: [], 
            isLoading: false, 
            isError:false, 
            isCruError: false });
    
    // url
    const [url, setUrl] = useState(get_initial_query(1));  //mock
    
    const handleGetSubmit = (event) => {
        setUrl(formatUrl(trainingDate, 1)); //mock
        event.preventDefault();
    };

    const handleChangeDate = (event) => {
        setTrainigDate(event.target.value);
    };

    const handleUpdateSubmit = (event) => {
        const new_data = dataFromForm(event); 
        dispatchTraining(
            { 
                type: "TRAINING_UPDATE", 
                payload: new_data
            }
        );
        try
        {
            setCookie("user_id", 1); ///
            if (!trainingDate)
            {
                dispatchTraining({ type: 'TRAINING_CRU_FAILURE' });
            }
            else
                postTrainingByDate(
                    get_initial_query(cookies.user_id), 
                    {training: new_data, date: trainingDate}
                );
        }
        catch (error)
        {
            console.log(error)
            dispatchTraining({ type: 'TRAINING_FETCH_FAILURE' }); // 
        }
        event.preventDefault();
    };

    useEffect(() => {
        dispatchTraining({ type: 'TRAINING_FETCH_INIT' });
        (async () => {
            try
            {
                const result = await getTrainingByDate(url);
                dispatchTraining(
                    { type: "TRAINING_FETCH_SUCCESS", payload: result.data }
                );
            }
            catch (error)
            {
                dispatchTraining({ type: 'TRAINING_FETCH_FAILURE' });
            }
        })();   

       
    }, [url]);

    const handleExAdd = () => {
       dispatchTraining({ type: 'TRAINING_ADD' }); 
    };

    const handleExDel = () => {
        dispatchTraining({ type: 'TRAINING_DEL' }); 
    };

    const addSet = (idx) => {
       dispatchTraining({ type: 'SET_ADD', idx: idx }); 
    };

    const delSet = (idx) => {
        dispatchTraining({ type: 'SET_DEL', idx: idx }); 
    };

    return (
        <>
            <DateTimeForm 
                searchTerm={trainingDate} 
                onSubmit={handleGetSubmit}
                onChange={handleChangeDate}
            />
            {training.isCruError && <p>Wrong Date </p>}
            {training.isError && <p>Something went wrong ...</p>}
            {training.isLoading ? ( <p>Loading ...</p> ) : 
                ( 
                    <TrainingFormList 
                        list={training.data} 
                        onSubmit={handleUpdateSubmit}
                        addSet={addSet}
                        delSet={delSet}
                        addEx={handleExAdd}
                        delEx={handleExDel}
                    /> 
                )
            }
        </>
    ); // create form list
};

export { GetUpdateDeleteTraining };