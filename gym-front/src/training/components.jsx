import { InputWithLabelD, Button } from "../components/components";

const LABELS = [ "Повторения", "Ожидаемое", "Факт" ];
const LABELS_EN = [ "reps", "expect", "fact" ];


const TrainingFormList = ({ list, onSubmit }) => {
    let count = 0;
    return (
        <>
            <form onSubmit={onSubmit}>
                <ul>
                    {list.map((item) => (
                        <FormItem id={"count"} key={count++} item={item}/>
                    ))}
                </ul>
                <button type="submit">Submit</button>
            </form>
        </>
    );
};

const to_add_load = {reps: null, expect: null, fact: null};

const FormItem = ({ item }) => {
    let count = 0;
    return (
        <li className="exercise">
            <InputWithLabelD key={count++} cls="title" defaultValue={item.title} 
                    isFocused>
            <strong>Упражнение</strong>
            </InputWithLabelD>
            <br/>
            {item.load.map(load => 
                <div key={count++} className="load">
                    <ObjectToForm  obj={load}/>
                    <br/>
                </div>)}
            <Button onClick={handleAdd}>+</Button>
            <Button onClick={handleDel}>-</Button>
        </li>
    );
};


const ObjectToForm = ({obj}) => {
    let count = 0;
    return  (   
        <>
            {Object.entries(obj).map(([k, v]) => 
            (          
                <InputWithLabelD key={count} cls={k} defaultValue={v} 
                    isFocused>
                    <strong>{LABELS[count++]}</strong>
                </InputWithLabelD>
            ))}
        </>
    )
}


export { TrainingFormList };