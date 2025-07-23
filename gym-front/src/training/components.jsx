import { InputWithLabel, Button } from "../components/components";
import { trainingData } from "../training/data";
import { useEffect, useState } from "react";


const LABELS = [ "повторения", "ожидаемый результат", "фактический" ];


const DateTimeForm = ({ searchTerm, onSubmit, onChange, type="datetime-local" }) => {
    return (
        <form onSubmit={onSubmit}>
            <InputWithLabel id="training-time" value={searchTerm} 
                onInputChange={onChange} type={type} isFocused>
                <strong>Дата тренировки: </strong>
            </InputWithLabel>
            <button type="submit">Найти</button>
        </form> 
    );
}


const TrainingFormList = ({ list, onSubmit, addEx, delEx, addSet, delSet }) => {
    if (list)
    {
        list.sort((a, b) => { return a.count - b.count; });
    }
    
    return (
        <>
            <form onSubmit={onSubmit}>
                <ul>
                    {list.map((item, idx) => (
                        <FormItem 
                            key={crypto.randomUUID()} 
                            item={item} 
                            exNum={item.count ? item.count : idx} 
                            addSet={addSet} 
                            delSet={delSet}
                        />
                    ))}
                </ul>
                <Button onClick={addEx}>Добавить Упражнение</Button>
                <Button onClick={delEx}>Удалить Упражнение</Button>
                <br/>
                <Button type="submit">Сохранить тренировку</Button>
            </form>
        </>
    );
};


const FormItem = ({ item, userData, exNum, addSet, delSet }) => {
    item.count = exNum;
    const [showError, setShowError] = useState(Boolean(item.error));
    
    const removeError = () => { setShowError(false); }; 
    return (
        <li className="exercise">
            <AutocompleteInput id={"title" + exNum} className="title" 
                userData={userData} removeError={removeError} item={item}/>
            <br/>
            {item.load.map(load => 
                <div key={crypto.randomUUID()} className="load">
                    <ObjectToForm obj={load} removeError={removeError}/>
                    <br/>
                </div>)}

            {showError && <p>{item.error}</p>}

            <Button onClick={() => addSet(exNum)}>+</Button>
            <Button onClick={() => delSet(exNum)}>-</Button>
        </li>
    );
};


const AutocompleteInput = ({ specData, item, id, removeError }) => {
   
    const [inputValue, setInputValue] = useState({title: item.exercise.title, id: item.exercise.id});
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const filtered = inputValue ? trainingData.filter(suggestion => 
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
    };


    return (
        <>
            <input className="title" type="text" placeholder="упражнение"
                value={inputValue?.title} onChange={handleChange} onClick={() => removeError()}
                id={id}/>
            
            {showSuggestions && (
            <ul>
                {filtered.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.title}
                </li>
                ))}
            </ul>
            )}
        </>
    );
}


const ObjectToForm = ({obj, removeError }) => {
    const onChange = (event) => {
        obj[event.target.className] = event.target.value;
    }
    let count = 0;
    return  (   
        <>
            {Object.entries(obj).map(([k, v]) => 
            (    
                <input key={crypto.randomUUID()} className={k} type="text" placeholder={LABELS[count++]}
                defaultValue={v} onChange={onChange} onMouseEnter={() => removeError()}/>
                    
            ))}
        </>
    )
}


export { TrainingFormList, DateTimeForm };