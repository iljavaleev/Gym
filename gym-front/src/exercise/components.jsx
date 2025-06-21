import { useState, useEffect } from "react";
import { InputWithLabel, Button } from "../components/components";

import { postUserEx } from "./utils";
import { useCookies } from "react-cookie";


const AddUserEx = ({ data }) => {
    const [ cookies ] = useCookies();    
    const [ add, setAdd ] = useState(false);
    const [ subm, setSubmit ] = useState(false);
    const [ ex, setEx ] = useState({ isError: false, isSuccess: false, title:"" });


    useEffect(() => {
        if (!subm) return;
        if (!ex.title) return;
        const user_id = cookies.user_id;
        try
        {   
            postUserEx(user_id, { title: ex.title });
            data.push(ex.title);
            setEx({ title:"", isError: false, isSuccess: true });
        }
        catch
        {
            setEx({ ...ex, isError: true });
        }   
        setSubmit(false);
    }, [subm]);

    const handleClickOpen = () => { setAdd(!add); setEx({...ex, isSuccess: false}) }

    const onChange = (event) => {
        setEx({ ...ex,  title: event.target.value});
    }
    const onClick = () => {
        setSubmit(true);
    }
    return (
        <>
            <Button onClick={handleClickOpen}>{add ? "Закрыть" : "Создать новое"}</Button>
            {
                add && <div>
                <InputWithLabel  onInputChange={onChange} >Введите название</InputWithLabel>
                <Button onClick={onClick}>Отправить</Button>
                { ex.isError && <><br/><strong>Error</strong></> }
                { ex.isSuccess && <strong>SUCCESS</strong> }
                </div>
            }
        </>
    );
}

const ListEx = ({ list }) => {
    return (
        <ul>
            {list.map((item) => (
                <Item key={item.id} item={item.title}/>
            ))}
        </ul>
    );
};

const Item = ({ item }) => (
    <li>
        <span>{item}</span>&nbsp;
    </li>
);

export { AddUserEx, ListEx };