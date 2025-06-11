import { useState, useReducer, useEffect, useCallback } from 'react';
import { DateTimeForm } from '../components/components';
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


const formatUrl = (date, user) =>  
    `http://192.168.1.159:8000/api/v1/search-by-date?user=${user}&date=${date}`;

const get_initial_query = (id) => {
    if (id)
        return formatUrl(Date.now(), id);
    return "";
};


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
            console.log(action.payload.event.target);
            return { ...state, 
                data: {
                    ...state.data,  
                    [action.payload.event.target.id]: action.payload.event.target.value
                }, 
                isLoading: false, 
                isError: false 
            };
        default:
            throw new Error();
    }
};


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
                console.log("res");
                console.log(payload);
                resolve();
            }
            else
                error(new Error());
        }
    );

}

const GetUpdateDeleteTraining = () => {
    
    // date
    const [ trainingDate, setTrainigDate ] = useState(null);

    // training data
    const [ training, dispatchTraining ] = useReducer(
        trainingReducer, {data: mock_data, isLoading: false, isError:false });
    
    // url
    const [url, setUrl] = useState(get_initial_query(1));  //mock
    const handleGetSubmit = (event) => {
        setTrainigDate(event.target.value);
        setUrl(formatUrl(trainingDate, 1)); //mock

        event.preventDefault();
    };

    const handleUpdateSubmit = (event) => {
        dispatchTraining(
            { 
                type: "TRAINING_UPDATE", 
                payload: { event: event } 
            }
        );
        
        try
        {
            postTrainingByDate(getUserId(), training.data);
        }
        catch (error)
        {
            dispatchTraining({ type: 'TRAINING_FETCH_FAILURE' });
        }
        event.preventDefault();
    };

    const getUserId = useCallback(() => {
        const [ cookies, setCookie ] = useCookies();
        //
        setCookie("user_id", 1);
        //
        return cookies.user_id;
    }, []);

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

    return (
        <>
            <DateTimeForm 
                searchTerm={trainingDate} 
                onSubmit={handleGetSubmit}
            />
            
            {training.isError && <p>Something went wrong ...</p>}
            {training.isLoading ? ( <p>Loading ...</p> ) : 
                ( <TrainingFormList 
                    list={training.data} 
                    onSubmit={handleUpdateSubmit}
                    /> 
                )
            } 
        </>
    ); // create form list
};

export { GetUpdateDeleteTraining };