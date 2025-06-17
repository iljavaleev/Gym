import { InputWithLabelD, Button } from "../components/components";

const LABELS = [ "Повторения", "Ожидаемое", "Факт" ];
const LABELS_EN = [ "reps", "expect", "fact" ];


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
                <Button type="submit">Submit</Button>
            </form>
        </>
    );
};


const FormItem = ({ item, exNum, addSet, delSet }) => {
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
                <InputWithLabelD key={count} cls={k} defaultValue={v} 
                    isFocused>
                    <strong>{LABELS[count++]}</strong>
                </InputWithLabelD>
            ))}
        </>
    )
}


export { TrainingFormList };