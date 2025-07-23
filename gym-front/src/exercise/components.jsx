import { useState, useEffect } from "react";
import { InputWithLabel, Button } from "../components/components";

import { postUserEx } from "./utils";
import { useCookies } from "react-cookie";
import { VALIDATION } from "./validation";

const AddUserEx = ({ data, onDataChange }) => {
    const [ cookies ] = useCookies();    
    const [ add, setAdd ] = useState(false);
    const [ subm, setSubmit ] = useState(false);
    const [ ex, setEx ] = useState({ isError: false, errorMsg: "",
        isSuccess: false, exercise:"" });
    
    useEffect(() => {
        if (!subm) return;
        if (!ex.exercise) return;
        if (!cookies.access_token) return;
        try
        {   
            
            const pr_id = postUserEx({ exercise: ex.exercise }, cookies.access_token);
            
            pr_id.then(dbex => {
                data.push({ id: dbex.data.id, exercise: dbex.data.exercise});
                onDataChange(data);
                setEx({ exercise:"", isError: false, isSuccess: true });
            });
           
        }
        catch (error)
        {
            console.log(error)
            setEx({ ...ex, isError: true, errorMsg: "Ошибка. Попробуйте позднее" });
        }   
        setSubmit(false);
    }, [subm]);

    const handleClickOpen = () => { 
        setAdd(!add); 
        setEx({...ex, isSuccess: false}) 
    }

    const onChange = (event) => { setEx({ ...ex,  
        exercise: event.target.value, isError: false, errorMsg: "" }); }
    
    const onClick = () => { 
        for (const validation of VALIDATION.exercise)
        {
            if (!validation.isValid(ex.exercise))
            {
                setEx({...ex, isError: true, errorMsg: validation.message});
                return;
            }
        }
        setSubmit(true); 
    
    }
    
    return (
        <>
            <Button onClick={handleClickOpen}>{add ? "Закрыть" : "Создать новое"}</Button>
            {
                add && <div>
                <InputWithLabel value={ex.exercise} onInputChange={onChange} >Введите название</InputWithLabel>
                <Button onClick={onClick}>Отправить</Button>
                { ex.isError && <><br/><strong>{ex.errorMsg}</strong></> }
                { ex.isSuccess && <strong>SUCCESS</strong> }
                </div>
            }
        </>
    );
}

const ListEx = ({ list, onDelete }) => {
    return (
        <ul>
            {list.map((item) => (
                <Item key={item.id} item={item.exercise} onDelete={() => onDelete(item.id)}/>
            ))}
        </ul>
    );
};

const Item = ({ item, onDelete }) => (
    <li>
        <span>{item}</span>
        &nbsp;
        <Button onClick={onDelete}>-</Button>
    </li>
);

export { AddUserEx, ListEx };