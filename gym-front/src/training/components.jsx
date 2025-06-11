import { InputWithLabelD } from "../components/components";

const LABELS = [ "Повторения", "Ожидаемое", "Факт" ];
const LABELS_EN = [ "reps", "expect", "fact" ];

const TrainingFormList = ({ list, onSubmit }) => {
    let count = 0;
    console.log(list);
    return (
        <>
            <form onSubmit={onSubmit}>
                <ul>
                    {list.map((item) => (
                        <FormItem key={count++} item={item}/>
                    ))}
                </ul>
                <button type="submit">Submit</button>
            </form>
        </>
    );
};

const FormItem = ({ item }) => {
    let count = 0;
    return (
            <li>
                <InputWithLabelD key={count++} id="title" defaultValue={item.title} 
                        isFocused>
                        <strong>Упражнение</strong>
                </InputWithLabelD><br/>
                <span>
                    {item.load.map((load, idx) => (
                        <InputWithLabelD key={count++} id={LABELS_EN[idx]} defaultValue={load[LABELS_EN[idx]]} 
                            isFocused>
                            <strong>{LABELS[idx]}</strong>
                        </InputWithLabelD>
                    ))}
                </span>
            </li>
    );
};



export { TrainingFormList };