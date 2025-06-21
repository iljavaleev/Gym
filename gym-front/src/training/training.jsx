import { useState, useReducer, useEffect } from 'react';
import { trainingReducer } from './reducers';
import { useCookies } from 'react-cookie'
import { TrainingFormList, DateTimeForm } from './components';
import { Button } from '../components/components';
import { getTrainingByDate, 
    postTrainingByDate, 
    delTrainingByDate,
    getInitialQuery, 
    dataFromForm 
} from './utils'; 

// array.splice(index, 1)


const GetUpdateDeleteTraining = ({date}) => {
    const [ cookies, setCookie ] = useCookies();
    
    // training data
    const [ training, dispatchTraining ] = useReducer(
        trainingReducer, {
            data: [], 
            isLoading: false, 
            isError:false, 
            isCruError: false });
    
    // url
    const [url, setUrl] = useState(getInitialQuery(1));  //mock
    
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
            if (!date)
            {
                dispatchTraining({ type: 'TRAINING_CRU_FAILURE' });
            }
            else
                postTrainingByDate(
                    getInitialQuery(cookies.user_id), 
                    {training: new_data, date: date}
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
       dispatchTraining({ type: 'EX_ADD' }); 
    };

    const handleExDel = () => {
        dispatchTraining({ type: 'EX_DEL' }); 
    };

    const addSet = (idx) => {
       dispatchTraining({ type: 'SET_ADD', idx: idx }); 
    };

    const delSet = (idx) => {
        dispatchTraining({ type: 'SET_DEL', idx: idx }); 
    };

    const handleDelTraining = () => {
        delTrainingByDate(url, date); // change url
        dispatchTraining({ type: 'TRAINING_DEL' });
    }


    return (
        <>
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
            <hr/>
            {training.data && <Button onSubmit={handleDelTraining}>Удалить тренировку</Button>}
        </>
    ); 
};

const Training = () => {
    // date
    const [ trainingDate, setTrainigDate ] = useState(null);
    const handleGetSubmit = (event) => {
        setUrl(formatDateUrl(date, 1)); //mock
        event.preventDefault();
    };

    const handleChangeDate = (event) => {
        setTrainigDate(event.target.value);
    };
    return (
        <> 
            <DateTimeForm 
                searchTerm={trainingDate} 
                onSubmit={handleGetSubmit}
                onChange={handleChangeDate}
            />
            <GetUpdateDeleteTraining date={trainingDate}/>
        </>
    ); // create form list
};


export { Training };