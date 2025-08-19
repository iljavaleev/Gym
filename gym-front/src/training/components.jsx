import { InputWithLabel, Button } from "../components/components";
import { trainingData } from "../training/data";
import { useState, useContext, useRef } from "react";
import { UserDataContext } from "../app/appContext";
import { useNavigate } from "react-router";

const LABELS = [ "повторения", "ожидаемый результат", "фактический" ];


const DateTimeForm = ({ searchTerm, onSubmit, onChangeDate, onChangeTime }) => {
    return (
        <form onSubmit={onSubmit} className="date-form-cintainer">
            <div id="date-time-part">
                <button type="submit" name="by_date">Найти тренировку по дате</button>
                <br/> 
                <InputWithLabel id="training-date" 
                    value={searchTerm.date} onInputChange={onChangeDate} 
                    type="date" isFocused>
                </InputWithLabel>
                <InputWithLabel id="training-time" 
                    value={searchTerm.time} onInputChange={onChangeTime} 
                    type="time" step="1" isFocused>
                </InputWithLabel>
            </div>
            <br/> 
            <button type="submit" name="next">Найти ближайшую тренировку</button>
        </form> 
    );
}


const TrainingFormList = ({ list, addEx, delEx, addSet, delSet, changed }) => {
    const navigate = useNavigate();
    if (list)
    {
        list.sort((a, b) => { return a.count - b.count; });
    }
    
    return (
        <>
            <form>
                <div className="exs-list stack">
                    {list.map((item, idx) => (
                        <FormItem 
                            key={crypto.randomUUID()} 
                            item={item} 
                            exNum={item.count ? item.count : idx} 
                            addSet={addSet} 
                            delSet={delSet}
                            changed={changed}
                        />
                    ))}
                </div>
                <div className="form-button">
                    <Button  onClick={addEx}>Добавить Упражнение</Button>
                    <Button  onClick={delEx}>Удалить Упражнение</Button>
                    <Button onClick={()=>{navigate("/my-training/exercise")}}>Создать свое упражнение</Button>
                </div>
            </form>
        </>
    );
};


const FormItem = ({ item, userData, exNum, addSet, delSet, changed }) => {
    item.count = exNum;
    const [showError, setShowError] = useState(Boolean(item.error));
    const removeError = () => { setShowError(false); delete item.error; }; 
    
    return (
        <div className="exercise">
            <AutocompleteInput id={"title" + exNum} className="title" 
                userData={userData} removeError={removeError} item={item} 
                changed={changed}
            />
            <br/>
            {item.load.map(load => 
                <div key={crypto.randomUUID()} className="load">
                    <ObjectToForm obj={load} removeError={removeError} 
                        changed={changed}
                    />
                    <br/>
                </div>)}

            {showError && <p>{item.error}</p>}

            <Button id="set-button-" onClick={() => { addSet(exNum); removeError(); }}>+</Button>
            <Button id="set-button+" onClick={() => { delSet(exNum); removeError(); }}>-</Button>
        </div>
    );
};


const AutocompleteInput = ({ item, id, removeError, changed }) => {
    const userExs = useContext(UserDataContext);
    const userTrainingData = useRef(userExs.concat(trainingData));
    
    const [inputValue, setInputValue] = useState({
        title: item.exercise.title, id: item.exercise.id});
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const filtered = inputValue ? userTrainingData.current.filter(suggestion => 
        {   
            const re = new RegExp(`(^| )(${inputValue?.title?.toLowerCase().trim()})+`);
            return re.test(suggestion.title.toLowerCase());
        }
    ) : [];
    
    const handleChange = (event) => {
        setShowSuggestions(true);
        setInputValue({ ...inputValue, title: event.target.value});
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue({ ...inputValue, title: suggestion.title, id: suggestion.id});
        item.exercise.title = suggestion.title;
        item.exercise.id = suggestion.id;
        setShowSuggestions(false);
        changed.current = true; 
    };


    return (
        <>
            <input className="title" type="text" placeholder="упражнение"
                value={inputValue?.title} onChange={handleChange} 
                onClick={() => removeError()} id={id}
            />
            
            {showSuggestions && (
            <ul>
                {filtered.map((suggestion, index) => (
                <li key={index} 
                    onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.title}
                </li>
                ))}
            </ul>
            )}
        </>
    );
}


const ObjectToForm = ({obj, removeError, changed }) => {
    const onChange = (event) => {
        obj[event.target.className] = event.target.value;
        changed.current = true;
    }
    let count = 0;

    return  (   
        <>
            {Object.entries(obj).map(([k, v]) => 
            (    
                <span className="input" key={crypto.randomUUID()}>
                    <input className={k} type="text" 
                        placeholder={LABELS[count++]} defaultValue={v} 
                        onChange={onChange} onMouseEnter={()=>removeError()}/>
                </span>    
            ))}
        </>
    )
}


export { TrainingFormList, DateTimeForm };