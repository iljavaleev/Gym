import { useCookies } from "react-cookie";
import { AutocompleteExInput, Button } from "../components/components";
import { useState, useRef, useEffect, useReducer } from "react";
import { StyledButton, StyledGenInput, StyledStatContainer } from "./styles";

const StatType = Object.freeze({ GEN: 1, MY: 2, DYN: 3 });

const requestUrl = (type) =>  
    `http://localhost:8000/api/v1/statistics?type=${type}`;


const getStatisticsByType = async (url, token=null) => {
    let result = {};
    try
    {
        result = await axios.get(url, token && 
            { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch (error)
    {
        return {
            status: error.response?.status,
            message: error.response?.data?.detail
        }
    }
    // const decoded = parseJwt(result.data.access_token);
    // return { access_token: result.data.access_token, 
    //     user_id: decoded.user_id, expire: decoded.exp }
    return;
}


const statReducer = (state, action) => {
    switch (action.type) 
    {
        case 'STAT_FETCH_INIT':
            return { ...state, isLoading: true, isError: false };
        case 'STAT_FETCH_SUCCESS':
            return {...state, statData: action.payload, graphData: [], 
                isLoading: false, isError: false, isGraph: false }
        case 'STAT_GRAPH_FETCH_SUCCESS':
            return {...state, graphData: action.payload, statData: {}, 
                isLoading: false, isError: false, isGraph: true }
        case 'STAT_FETCH_FAILURE':
            return { ...state, isLoading: false, isError: true };
        default:
            throw new Error();
    }
};


const Statistics = () => {
    const [ cookies, removeCookie ] = useCookies();
    
    const [stats, dispatchStats] = useReducer(
            statReducer, 
            {
                graphData: [], statData: {}, isLoading: false, isError:false,
                isGraph: false 
            }
    );
     const [url, setUrl] = useState("");

    const [item, setItem] = useState({id:"", title: ""});
    const [action, setAction] = useState(0);
    const handleSuggestionClick = (suggestion) => {
        setItem({...suggestion});
    };

    const inputRef = useRef();
    useEffect(() => {
        if (inputRef.current) 
        {
            inputRef.current.focus();
        }
    });
    
    
    useEffect(() => {
        if (action == 0 || (!cookies.access_token && action != StatType.GEN))
            dispatchStats({ type: 'STAT_FETCH_FAILURE' });;
        
        dispatchStats({ type: 'STAT_FETCH_INIT' });

        (async () => {
            try
            {
                const result = await getStatisticsByType(url, cookies.access_token);
                if (action == StatType.MY)
                {
                    dispatchStats(
                        { type: "STAT_FETCH_SUCCESS", 
                            payload: result.data.stories }
                    );
                }
                else
                {
                    dispatchStats(
                        { type: "STAT_GRAPH_FETCH_SUCCESS", 
                            payload: result.data.stories }
                    );
                }
               
            }
            catch (error)
            {
                dispatchStats({ type: 'STAT_FETCH_FAILURE' });
            }
        })();   
    }, [url]);

    const onSearch = (event) => { 
        setUrl(requestUrl(action)); 
        event.preventDefault();
    }

    return (
        <StyledStatContainer>
            <StyledStatContainer className="area">
                <StyledGenInput className="stat-input">
                    <AutocompleteExInput
                        item={item}
                        ref={inputRef} 
                        handleSuggestionClick={handleSuggestionClick}
                    />
                </StyledGenInput>
                <span>Выберите тип:</span>
                <StyledButton className="stat-choice-search">
                    <div className="choice">
                        <Button  
                            style={{backgroundColor: action  == StatType.GEN ? 
                                "#578f6db4" : "#fffefef8"}} 
                            onClick={() => setAction(1)} >Общая статистика
                        </Button>
                        <Button  
                            style={{ backgroundColor: action == StatType.MY ? 
                                "#578f6dbb" : "#fffefef8"}} 
                                onClick={() => setAction(2)} >
                                Моя статистика
                        </Button>
                        <Button  
                            style={{ backgroundColor: action  == StatType.DYN ? 
                                "#578f6dbb" : "#fffefef8"}} 
                                onClick={() => setAction(3)} >
                                Динамика упражнения
                        </Button>
                    </div>
                    <div className="search">
                        <Button cls="submit-button" 
                            onClick={() => onSearch()} type="submit">
                            Поиск
                        </Button>
                    </div>
                </StyledButton>
            </StyledStatContainer>
            <div className="program-search area">
                {!stats.isGraph && {/* {stories.isError && <p>Something went wrong ...</p>}
                {stories.isLoading ? ( <p>Loading ...</p> ) : 
                    ( <List list={stories.data} /> )} */}}
                {stats.isGraph && {}}
            </div>        
        </StyledStatContainer>  
        
    ); 
}

export { Statistics };