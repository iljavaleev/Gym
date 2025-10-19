import { InputWithLabel, Button, AutocompleteExInput } from "../components/components";
import { useState } from "react";
import { useNavigate } from "react-router";



const LABELS = { reps: "повторения", expect: "ожидаемый результат", 
    fact: "фактический" };

const DateTimeForm = ({ searchTerm, onSubmit, onChangeDate, onChangeTime }) => {
    return (
        <form onSubmit={onSubmit} className="date-form-container">
            <div id="date-time-part">
                <button type="submit" name="by_date">
                    Найти тренировку по дате
                </button>
                <br/> 
                <InputWithLabel id="training-date" 
                    value={searchTerm.date} onInputChange={onChangeDate} 
                    type="date" isFocused>
                </InputWithLabel>
                <InputWithLabel id="training-time" 
                    value={searchTerm.time} onInputChange={onChangeTime} 
                    type="time" step="1800" isFocused min="06:00" max="21:00">
                </InputWithLabel>
            </div>
            <br/> 
            <button type="submit" name="next">
                Найти ближайшую тренировку
            </button>
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
                    <Button onClick={()=>{navigate("/my-training/exercise")}}>
                        Создать свое упражнение
                    </Button>
                </div>
            </form>
        </>
    );
};


const FormItem = ({ item, exNum, addSet, delSet, changed }) => {
    item.count = exNum;
    const [showError, setShowError] = useState(Boolean(item.error));
    const removeError = () => { setShowError(false); delete item.error; }; 
    
    const handleSuggestionClick = (suggestion) => {
        item.exercise.title = suggestion.title;
        item.exercise.id = suggestion.id;
        changed.current = true;
    };
    
    return (
        <div className="exercise">
            <AutocompleteExInput id={"title" + exNum} className="title" 
                onInputClick={removeError} 
                handleSuggestionClick={handleSuggestionClick}
                item={item.exercise}
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

            <Button className="button-" onClick={() => { 
                addSet(exNum); removeError(); }}>+</Button>
            <Button className="button+" onClick={() => { 
                delSet(exNum); removeError(); }}>-</Button>
        </div>
    );
};


const ObjectToForm = ({obj, removeError, changed }) => {
    const onChange = (event) => {
        obj[event.target.className] = event.target.value;
        changed.current = true;
    }

    return  (   
        <>
            {
                <span className="input" >
                    <input key={crypto.randomUUID()} className="reps" type="text" 
                        placeholder={LABELS.reps} defaultValue={obj.reps} 
                        onChange={onChange} onMouseEnter={()=>removeError()}/>
                    <input key={crypto.randomUUID()} className="expect" type="text" 
                        placeholder={LABELS.expect} defaultValue={obj.expect} 
                        onChange={onChange} onMouseEnter={()=>removeError()}/>
                    <input key={crypto.randomUUID()} className="fact" type="text" 
                        placeholder={LABELS.fact} defaultValue={obj.fact} 
                        onChange={onChange} onMouseEnter={()=>removeError()}/>
                </span>
                    
            }
        </>
    )
}


export { TrainingFormList, DateTimeForm };