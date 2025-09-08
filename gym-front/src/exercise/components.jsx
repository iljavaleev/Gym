import { useState, useEffect, useContext, memo } from "react";
import { InputWithLabel, Button } from "../components/components";
import { postUserEx } from "./utils";
import { useCookies } from "react-cookie";
import { VALIDATION } from "./validation";
import { UserDataContext } from "../app/appContext";
import { useNavigate } from "react-router";


const AddUserEx = ({ onDataChange }) => {
    const navigate = useNavigate();
    
    const [ cookies, removeCookie ] = useCookies();    
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
                setTimeout(() => setEx({...ex, title:"", isSuccess: false}), 2000);
            })();
        }
        catch (error)
        {
            if (error?.response?.status == 401)
            {
                removeCookie("access_token");
            }
            console.log(error)
            setEx({ ...ex, isError: true, 
                errorMsg: "Ошибка. Попробуйте позднее" });
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
            <Button cls="create-close" onClick={handleClickOpen}>
                {add ? "-" : "+"}
            </Button>
            {
                add && <div className="exs-container">
                    <div>Вы можете создать не более 20 своих упражнений</div>
                    <InputWithLabel cls="custom-title" value={ex.title} 
                        onInputChange={onChange} help="введите название"/>
                    {data.length < 20 && <Button cls="comlete-button" onClick={onClick}>
                        Создать
                    </Button>}
                    { ex.isError && <><br/><strong>{ex.errorMsg}</strong></> }
                    { ex.isSuccess && <><br/><strong>Успешно</strong></> }
                </div>
            }
            <Button cls="comlete-button" onClick={handleToTraining}>
                Обратно к тренировке
            </Button>
        </>
    );
}

const ListEx = memo(({ onDelete }) => {
    const list = useContext(UserDataContext);
    return (
        <ul>
            {list.map((item) => (
                <Item key={item.id} item={item.title} 
                    onDelete={() => onDelete(item.id)}/>
            ))}
        </ul>
    );
});

const Item = memo(({ item, onDelete }) => {
    return (
    <li>
        <span>{item}</span>
        &nbsp;
        <Button onClick={onDelete}>-</Button>
    </li>
)});

export { AddUserEx, ListEx };