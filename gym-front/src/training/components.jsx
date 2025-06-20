import { InputWithLabel, Button, AutocompleteInput } from "../components/components";
import { trainingData } from "../training/data";

const LABELS = [ "Повторения", "Ожидаемое", "Факт" ];


const DateTimeForm = ({ onSubmit, onChange, type="datetime-local" }) => {
    
    return (
            <form onSubmit={onSubmit}>
                <InputWithLabel id="training-time" defaultValue={Date.now()} 
                    onInputChange={onChange} type={type} isFocused>
                    <strong>Дата тренировки: </strong>
                </InputWithLabel>
                <button type="submit">Найти</button>
            </form>
    );
}


const TrainingFormList = ({ list, onSubmit, addEx, delEx, addSet, delSet }) => {
    let count = 0;
    return (
        <>
            <form onSubmit={onSubmit}>
                <ul>
                    {list.map((item, idx) => (
                        <FormItem 
                            id={"count"} 
                            key={count++} 
                            item={item} 
                            exNum={idx} 
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


const FormItem = ({ item, userArray, exNum, addSet, delSet }) => {
    let count = 0;
    
    return (
        <li className="exercise">
            <AutocompleteInput baseData={trainingData}  userData={userArray} val={item.title}>
                <strong>Упражнение</strong>
            </AutocompleteInput>
            {/* добавить возможность создавать упражнение */}
            <br/>
            {item.load.map(load => 
                <div key={count++} className="load">
                    <ObjectToForm  obj={load}/>
                    <br/>
                </div>)}
            <Button onClick={() => addSet(exNum)}>+</Button>
            <Button onClick={() => delSet(exNum)}>-</Button>
        </li>
    );
};


const ObjectToForm = ({obj}) => {
    let count = 0;
    return  (   
        <>
            {Object.entries(obj).map(([k, v]) => 
            (          
                <InputWithLabel key={count} cls={k} defaultValue={v} 
                    isFocused>
                    <strong>{LABELS[count++]}</strong>
                </InputWithLabel>
            ))}
        </>
    )
}


export { TrainingFormList, DateTimeForm };