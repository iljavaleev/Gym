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
        isSuccess: false, title:"" });
    
    useEffect(() => {
        if (!subm) return;
        if (!ex.title) return;
        const user_id = cookies.user_id;
        try
        {   
        
            const pr_id = postUserEx(user_id, { title: ex.title });
            pr_id.then(id => {
                data.push({ id: id, title: ex.title});
                onDataChange(data);
                setEx({ title:"", isError: false, isSuccess: true });
            });
           
        }
        catch
        {
            setEx({ ...ex, isError: true, errorMsg: "Ошибка. Попробуйте позднее" });
        }   
        setSubmit(false);
    }, [subm]);

    const handleClickOpen = () => { 
        setAdd(!add); 
        setEx({...ex, isSuccess: false}) 
    }

    const onChange = (event) => { setEx({ ...ex,  
        title: event.target.value, isError: false, errorMsg: "" }); }
    
    const onClick = () => { 
        for (const validation of VALIDATION.title)
        {
            if (!validation.isValid(ex.title))
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
                <InputWithLabel value={ex.title} onInputChange={onChange} >Введите название</InputWithLabel>
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
                <Item key={item.id} item={item.title} onDelete={() => onDelete(item.id)}/>
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