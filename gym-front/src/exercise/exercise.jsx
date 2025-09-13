import { AddUserEx, ListEx } from "./components";
import { deleteUserEx } from "./utils";
import { useCookies } from "react-cookie";
import { UserDataContext } from "../app/appContext";
import { useContext, useCallback } from "react";
import { StyledCustomEx } from "./styles";

const Exercise = ({onChange}) => {
    const [ cookies, removeCookie ] = useCookies();
    const userExs = useContext(UserDataContext);

    const onDelete = useCallback(async(id) => {
        try
        {   
            if (cookies.access_token)
                await deleteUserEx(id, cookies.access_token).catch((error) => {
                    if (error?.response?.status == 401)
                    {
                        removeCookie("access_token");
                    }
                }
            );
            onChange(userExs.filter(it => it.id !== id));
        }
        catch(error)
        {
            console.error(error);
        }
    }, [userExs]);

    return (
        <StyledCustomEx className="area"> 
            <ListEx onDelete={onDelete}/>
            <AddUserEx onDataChange={onChange} />           
        </StyledCustomEx>
    ); 
}

export { Exercise };