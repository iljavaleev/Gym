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



const Training = () => {
    const [ cookies, setCookie ] = useCookies();
    const [ trainingDate, setTrainigDate ] = useState({ date: null, isDateError: false });
    const handleGetSubmit = (event) => {
        setUrl(formatDateUrl(trainingDate.date, 1)); //mock
        event.preventDefault();
    };

    const handleChangeDate = (event) => {
        setTrainigDate({ isDateError: false, date: event.target.value});
    };

    // training data
    const [ trainingForm, dispatchTraining ] = useReducer(
        trainingReducer, 
        { data: [], isLoading: false, isError:false, isCruError: false }
    );
    
    // url
    const [url, setUrl] = useState(getInitialQuery(1));  //mock
    
    const handleUpdateSubmit = (event) => {
        let new_data = null;
        let hasErrors = null;
        try
        {
           [new_data, hasErrors] = dataFromForm(event);
        }
        catch(error)
        {
            console.error(error);
        }
        
        if (!trainingDate.date)
        {
            setTrainigDate({...trainingDate, isDateError: true});
            console.log(trainingDate.date)
            event.preventDefault();
            return;
        }

        if (hasErrors )
        {
            dispatchTraining({ type: 'TRAINING_CRU_FAILURE' });
            event.preventDefault();
            return;
        }

        dispatchTraining({ type: "TRAINING_UPDATE", payload: new_data });
        setCookie("user_id", 1); /// mock
                        
        try
        {
            postTrainingByDate(
                getInitialQuery(cookies.user_id), 
                {trainingForm: new_data, date: trainingDate}
            );
            dispatchTraining({ type: 'TRAINING_CRU_SUCCESS' });
        }
        catch (error)
        {
            console.log(error)
            dispatchTraining({ type: 'TRAINING_CRU_FAILURE' }); // 
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
            <DateTimeForm 
                searchTerm={trainingDate} 
                onSubmit={handleGetSubmit}
                onChange={handleChangeDate}
            />

            {trainingDate.isDateError && <p>Wrong Date </p>}
            {trainingForm.isError && <p>Something went wrong ...</p>}
            {trainingForm.isLoading ? ( <p>Loading ...</p> ) : 
                ( 
                    <TrainingFormList 
                        list={trainingForm.data} 
                        onSubmit={handleUpdateSubmit}
                        addSet={addSet}
                        delSet={delSet}
                        addEx={handleExAdd}
                        delEx={handleExDel}
                    /> 
                )
            }
            <hr/>
            {trainingForm.data && <Button onSubmit={handleDelTraining}>Удалить тренировку</Button>}
        </>
    ); 
};

export { Training };