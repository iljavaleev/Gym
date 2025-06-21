import { useState, useEffect } from "react";
import { AddUserEx, ListEx } from "./components";
import { getUserExs } from "./utils";
import { useCookies } from "react-cookie";


const Exercise = () => {
    const [ cookies ] = useCookies();
    const [ userExs, setUserExs ] = useState({ data: [] });


    useEffect(() => {
        const user = cookies.user_id;

        (async () => {
            try
            {
                const user_data = await getUserExs(user);
                setUserExs(user_data); 
            }
            catch (error)
            {
                console.log(error);
            }
        })();
    }, []);

    return (
        <> 
            <ListEx list={userExs.data}/>
            <AddUserEx data={userExs.data}/>           
        </>
    ); 
}

export { Exercise };