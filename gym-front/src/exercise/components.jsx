import { useState, useEffect, useContext } from "react";
import { InputWithLabel, Button } from "../components/components";
import { postUserEx } from "./utils";
import { useCookies } from "react-cookie";
import { VALIDATION } from "./validation";
import { UserDataContext } from "../app/appContext";
import { useNavigate } from "react-router";


const AddUserEx = ({ onDataChange }) => {
    const navigate = useNavigate();
    
    const [ cookies ] = useCookies();    
    const [ add, setAdd ] = useState(false);
    const [ subm, setSubmit ] = useState(false);
    const [ ex, setEx ] = useState({ 
        isError: false, 
        errorMsg: "", 
        isSuccess: false, title:"" 
    });
    
    const data = useContext(UserDataContext);

    useEffect(() => {
        if (!subm) return;
        if (!ex.title) return;
        if (!cookies.access_token) return;
        
        try
        {   
            (async () => {
                const result = await postUserEx({ title: ex.title }, 
                    cookies.access_token);
                data.push({ id: result.data.id, title: result.data.title});
                onDataChange([...data]);
                setEx({ title:"", isError: false, isSuccess: true });
            })();
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
    
    const handleToTraining = () => {
        navigate("/my-training");
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
            <Button onClick={handleToTraining}>Обратно к тренировке</Button>
        </>
    );
}

const ListEx = ({ onDelete }) => {
    const list = useContext(UserDataContext);
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