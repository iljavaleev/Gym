import { useState, useReducer, useEffect, useRef, useContext } from 'react';
import { trainingReducer } from './reducers';
import { useCookies } from 'react-cookie'
import { TrainingFormList, DateTimeForm } from './components';
import { Button } from '../components/components';
import { getTrainingByDate, 
    postTrainingByDate, 
    delTrainingByDate, 
    dataHasErrors,
    formatGetDelTrainigUrl, 
    getInitialQueryUrl
} from './utils'; 
import { UserDataContext } from "../app/appContext";
import { trainingData } from './data';
import styled from 'styled-components';

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

const StyledContainer = styled.div`
    display: flex;
    gap: var(--gap-size);
    flex-direction: column;
    
    button
    {
        background-color: #ebf133a0;
    }
    

    .dateForm
    {
        flex: 1;
        
        .date-form-cintainer
        {
            display: flex;
            gap: var(--gap-size);
            flex-direction: row;
            justify-content: center;
            align-items: start;
        }

        #date-time-part
        {
            display: flex;
            flex-wrap:wrap;
            justify-content: center;
        }
        
    }

    .trainingForm
    {   
        flex: 1;
        .exs-list
        {
            display: flex;
            gap: var(--gap-size);
            flex-direction: row;
            flex-wrap: wrap;
            align-content: center;
            justify-content: center;
            >div
            {
                margin-block-start: 0;
            }
        }

        .input > input
        {
            width: 6rem;
            padding: 0.5em;
            text-align: center;
        }
        
        .title
        {
            width: 18rem;
            padding: 0.5em;
            text-align: center;
        }
        
        .form-button
        {
            padding: 1em;
            display: flex;
            gap: 0.3em;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            
            >button
            {
                min-width: 16em;
            }
        }

    }

    .trainingAction
    {   
        flex: 1;
        display: flex;
        gap: 0.3em;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        align-items: start;
        >button
        {
            margin-block-start: 0;
            width: 16em;
            
        }
    }

`;


const Training = () => {
    
    const [ cookies ] = useCookies();
    const [ trainingDate, setTrainigDate ] = useState({ date: "", time:"", 
        isDateError: false });
    const [ successState, setSuccessState ] = useState({isCruSuccess: false, 
        isDeleteSuccess: false});
    const changed = useRef(false);
    
    const handleChangeDate = (event) => {
        setTrainigDate({ ...trainingDate, date: event.target.value, 
            isDateError: false});
        changed.current = true;
    };

    const handleChangeTime = (event) => {
        setTrainigDate({ ...trainingDate, time: event.target.value, 
            isDateError: false});
        changed.current = true;
    };

    // training data
    const [ trainingForm, dispatchTraining ] = useReducer(
        trainingReducer, 
        { data: [], isLoading: false, isError:false, isCruError: false }
    );

    useEffect(() => {
        let data = localStorage.getItem("training");
        if (data)
        {   
            data = JSON.parse(data);
            dispatchTraining(
                { 
                    type: "TRAINING_FETCH_SUCCESS", 
                    payload: data.training 
                }
            );
            setTrainigDate({ ...trainingDate, date: data.date, time: data.time});
        }            
    }, []);



    const handleGetSubmit = async (event) => {
        event.preventDefault();
        
        const action = event.nativeEvent.submitter.name;
        let url = null;

        if (action === "next")
            url = getInitialQueryUrl();
        else
            url = formatGetDelTrainigUrl(
                `${trainingDate.date}T${trainingDate.time}`
            );

        try
        {
            const result = await getTrainingByDate(url, cookies.access_token);
            dispatchTraining(
                { 
                    type: "TRAINING_FETCH_SUCCESS", 
                    payload: result.data?.training 
                }
            );
            let [date, time] = result.data.date.split("T")
            time = time.slice(0, 5);
            setTrainigDate({ ...trainingDate, date: date, time: time});
            localStorage.setItem("training", JSON.stringify(
                {training: result.data.training, date: date, time:time}));
        }
        catch (error)
        {
            console.log(error)
            dispatchTraining({ type: 'TRAINING_FETCH_FAILURE' });
        }
    };

    const userExs = useContext(UserDataContext);

    const handleUpdateSubmit = async (event) => {
        event.preventDefault();
        if (!changed.current)
        { 
            return; 
        }
                 

        if (!(trainingDate.date && trainingDate.time))
        {
            setTrainigDate({...trainingDate, isDateError: true });
            return;
        }

        try
        {                           
            if (dataHasErrors(trainingForm.data, trainingData.concat(userExs)))
            {
                dispatchTraining({ type: 'TRAINING_CRU_FAILURE' });
                event.preventDefault();
                return;
            }
        }
        catch(error){ console.error(error); }


        if (!trainingDate.date)
        {
            setTrainigDate({...trainingDate, isDateError: true});
            event.preventDefault();
            return;
        }

        try
        {
            postTrainingByDate(
                {date: `${trainingDate.date}T${trainingDate.time}`, 
                    training: trainingForm.data},
                cookies.access_token
            );
        }
        catch (error)
        {
            console.log(error)
            dispatchTraining({ type: 'TRAINING_CRU_FAILURE' }); // 
            return;
        }
        dispatchTraining({ type: 'TRAINING_CRU_SUCCESS' });
        localStorage.setItem("training", JSON.stringify(
            {
                training: trainingForm.data, 
                date: trainingDate.date, 
                time:trainingDate.time
            })
        );

        setSuccessState({...successState, isCruSuccess: true});
        setTimeout(() => {
            setSuccessState({...successState, isCruSuccess: false});
        }, 3000);
        
        changed.current = false;
    };

    const handleExAdd = () => { 
        dispatchTraining({ type: 'EX_ADD' });
        changed.current = true; 
    };
    const handleExDel = () => { 
        dispatchTraining({ type: 'EX_DEL' });
        changed.current = true;  
    };

    const addSet = (idx) => {
        dispatchTraining({ type: 'SET_ADD', idx: idx });
        changed.current = true; 
    };
    const delSet = (idx) => {
        dispatchTraining({ type: 'SET_DEL', idx: idx });
        changed.current = true; 
    };

    const handleDelTraining = () => {
        delTrainingByDate(`${trainingDate.date}T${trainingDate.time}`, 
            cookies.access_token); // change url
        dispatchTraining({ type: 'TRAINING_DEL' });
        setSuccessState({...successState, isDeleteSuccess: true});
            setTimeout(() => {
                setSuccessState({...successState, isDeleteSuccess: false});
        }, 3000);
    }

    return (
        <StyledContainer>
            <div className="dateForm area">
                <DateTimeForm 
                    searchTerm={trainingDate} 
                    onSubmit={handleGetSubmit}
                    onChangeDate={handleChangeDate}
                    onChangeTime={handleChangeTime}
                />
            </div>
            <div className="trainingForm area">
                {trainingDate.isDateError && <p>Неправильно указана дата</p>}
                {trainingForm.isError && <p>Что-то пошло не так...</p>}
                {trainingForm.isCruError && <p>Ошибка. Данные не сохранены</p> }
                {trainingForm.isLoading ? ( <p>Загружаем данные...</p> ) : 
                    ( 
                        <TrainingFormList 
                            list={trainingForm.data} 
                            addSet={addSet}
                            delSet={delSet}
                            addEx={handleExAdd}
                            delEx={handleExDel}
                            changed={changed}
                        /> 
                    )
                }
                {successState.isCruSuccess && <p>Тренировка успешно сохранена</p>}
                {successState.isDeleteSuccess && <p>Тренировка успешно удалена</p>}
            </div>
            
            {Boolean(trainingForm.data.length) && 
                <div className="trainingAction area stack"> 
                <Button onClick={handleUpdateSubmit}>Создать тренировку Сохранить Изменения</Button>
                <Button onClick={handleDelTraining}>Удалить тренировку</Button>
                </div>
            }
        </StyledContainer>
    ); 
};

export { Training };