import { useState, useEffect } from "react";
import { AddUserEx, ListEx } from "./components";
import { getUserExs, deleteUserEx } from "./utils";
import { useCookies } from "react-cookie";
import logger from "react-logger";



const Exercise = () => {
    const [ cookies ] = useCookies();
    const [ userExs, setUserExs ] = useState({ data: [] });


    useEffect(() => {
        (async () => {
            try
            {
                const user_data = await getUserExs(cookies.user_id);
                setUserExs(user_data); 
            }
            catch (error)
            {
                console.log(error);
            }
        })();
    }, []);

    const handleChange = (data) => {
        setUserExs({data: data});
    };

    const onDelete = async(id) => {
        try
        {   
            await deleteUserEx(cookies.user_id, { id: id });
            setUserExs({data: userExs.data.filter(it => it.id !== id)});
        }
        catch(error)
        {
            logger.error(error);
        }
    };

    return (
        <> 
            <ListEx list={userExs.data} onDelete={onDelete}/>
            <AddUserEx data={userExs.data} onDataChange={handleChange} />           
        </>
    ); 
}

export { Exercise };