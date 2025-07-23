import { useState, useEffect } from "react";
import { AddUserEx, ListEx } from "./components";
import { getUserExs, deleteUserEx } from "./utils";
import { useCookies } from "react-cookie";


const Exercise = () => {
    const [ cookies ] = useCookies();
    const [ userExs, setUserExs ] = useState({ data: [] });


    useEffect(() => {
        (async () => {
            try
            {
                if (cookies.access_token)
                {
                    const user_data = await getUserExs(cookies.access_token);
                    setUserExs(user_data); 
                }
                else
                {
                    setUserExs([]); 
                }
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
            if (cookies.access_token)
                await deleteUserEx(id, cookies.access_token);
            setUserExs({data: userExs.data.filter(it => it.id !== id)});
        }
        catch(error)
        {
            console.error(error);
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