import { AddUserEx, ListEx } from "./components";
import { deleteUserEx } from "./utils";
import { useCookies } from "react-cookie";
import { UserDataContext } from "../app/appContext";
import { useContext } from "react";

const Exercise = ({onChange}) => {
    const [ cookies ] = useCookies();
    const userExs = useContext(UserDataContext);

    const onDelete = async(id) => {
        try
        {   
            if (cookies.access_token)
                await deleteUserEx(id, cookies.access_token);
            onChange(userExs.filter(it => it.id !== id));
        }
        catch(error)
        {
            console.error(error);
        }
    };

    return (
        <> 
            <ListEx onDelete={onDelete}/>
            <AddUserEx onDataChange={onChange} />           
        </>
    ); 
}

export { Exercise };