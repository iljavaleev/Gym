import { useState, useReducer, useEffect } from 'react';
import { trainingReducer } from './reducers';
import { useCookies } from 'react-cookie'
import { TrainingFormList, DateTimeForm } from './components';
import { Button } from '../components/components';
import { getTrainingByDate, 
    postTrainingByDate, 
    delTrainingByDate,
    getInitialQuery, 
    dataHasErrors,
    formatGetDelTrainigUrl 
} from './utils'; 
import { getUserExs } from '../exercise/utils';

// {
//   "date": "2025-07-16T15:54:56.070Z",
//   "training": [
//     {
//       "count": 0,
//       "exercise": {
//         "id": 0,
//         "title": "string"
//       },
//       "load": [
//         {
//           "reps": 0,
//           "expect": 0,
//           "fact": 0
//         }
//       ]
//     }
//   ]
// }


// /api/v1/user-exercise

const Training = () => {
    const [ cookies ] = useCookies();
    const [ trainingDate, setTrainigDate ] = useState({ date: "", isDateError: false });
    
    const handleGetSubmit = (event) => {
        setUrl(formatGetDelTrainigUrl(trainingDate.date)); //mock
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
    
    // console.log(trainingForm.data);
    
    // url
    const [url, setUrl] = useState(getInitialQuery());
    
    const handleUpdateSubmit = (event) => {
        event.preventDefault();
        let hasErrors = null;
        try
        {                           
            hasErrors = dataHasErrors(trainingForm.data);
        }
        catch(error)
        {
            console.error(error);
        }
        if (hasErrors)
        {
            dispatchTraining({ type: 'TRAINING_CRU_FAILURE' });
            event.preventDefault();
            return;
        }

        if (!trainingDate.date)
        {
            setTrainigDate({...trainingDate, isDateError: true});
            event.preventDefault();
            return;
        }

        try
        {
            postTrainingByDate(
                {date: trainingDate.date, training: trainingForm.data},
                cookies.access_token
            );
            dispatchTraining({ type: 'TRAINING_CRU_SUCCESS' });
        }
        catch (error)
        {
            console.log(error)
            dispatchTraining({ type: 'TRAINING_CRU_FAILURE' }); // 
        }
    };

    // get training date on url change
    
    
    
    
    useEffect(() => {
        dispatchTraining({ type: 'TRAINING_FETCH_INIT' });
        (async () => {
            try
            {
                const result = await getTrainingByDate(url, cookies.access_token);
                dispatchTraining(
                    { type: "TRAINING_FETCH_SUCCESS", payload: result.data?.training }
                );
                setTrainigDate({ ...trainingDate, date: new Date(result.data.date).toISOString().split(".")[0]});
            }
            catch (error)
            {
                console.log(error)
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
                searchTerm={trainingDate.date} 
                onSubmit={handleGetSubmit}
                onChange={handleChangeDate}
            />

            {trainingDate.isDateError && <p>Неправильно указана дата</p>}
            {trainingForm.isError && <p>Что-то пошло не так...</p>}
            {trainingForm.isLoading ? ( <p>Загружаем данные...</p> ) : 
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