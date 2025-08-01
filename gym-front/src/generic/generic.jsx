import { Button, SearchForm } from "../components/components";
import { useStorageState } from "../customhooks/hooks"
import { List } from "./components";
import { useReducer, useState, useEffect } from "react";
import axios from 'axios';


// const formatUrl = (book, number) =>  
//     `http://0.0.0.0:5555/api/v1/search?book=${book}&number=${number}`;

const formatUrl = (book, number) =>  
    `http://localhost:8000/api/v1/search?book=${book}&number=${number}`;

const INITIAL_QUERY = formatUrl(0, 1);

const storiesReducer = (state, action) => {
    switch (action.type) 
    {
        case 'TRAINING_FETCH_INIT':
            return { ...state, isLoading: true, isError: false };
        case 'TRAINING_FETCH_SUCCESS':
            return { ...state, 
                data: action.payload, 
                isLoading: false, 
                isError: false };
        case 'TRAINING_FETCH_FAILURE':
            return { ...state, isLoading: false, isError: true };
        default:
            throw new Error();
    }
};


const getTrainingByNumber = async (url) => {
    const result = await axios(url);
    return new Promise((resolve, error) => {
            if (result)
                resolve({ data: { stories: result.data } });
            else
                error(new Error());
        }
    );
}


const Generic = () => {
    const [searchNumberTerm, setSearchNumberTerm] = useStorageState("search", "1");
    const [bookTerm, setBookTerm] = useState(0);

    const [stories, dispatchStories] = useReducer(
        storiesReducer, {data: [], isLoading: false, isError:false });
    
    const [url, setUrl] = useState(`${INITIAL_QUERY}`);

    const handleSearchSubmit = (event) => {
        setUrl(formatUrl(bookTerm, searchNumberTerm));

        event.preventDefault();
    };

    useEffect(() => {
        dispatchStories({ type: 'TRAINING_FETCH_INIT' });
        const cachedResult = JSON.parse(localStorage.getItem(url));

        if (cachedResult)
        {
            dispatchStories(
                { type: "TRAINING_FETCH_SUCCESS", payload: cachedResult }
            );
        }
        else
        {
            (async () => {
                try
                {
                    const result = await getTrainingByNumber(url);
                    localStorage.setItem(url, JSON.stringify(result.data.stories));
                    dispatchStories(
                        { type: "TRAINING_FETCH_SUCCESS", payload: result.data.stories }
                    );
                }
                catch (error)
                {
                    dispatchStories({ type: 'TRAINING_FETCH_FAILURE' });
                }
            })();   
        }
       
    }, [url]);

    const handleSearch = (event) => { setSearchNumberTerm(event.target.value); };

    return (
        <>
            <Button onClick={() => setBookTerm(0)}>Пауэрлифтинг</Button>
            <Button onClick={() => setBookTerm(1)}>Похудайка</Button>
            
            <SearchForm searchTerm={searchNumberTerm} 
                        onSearchSubmit={handleSearchSubmit} 
                        onSearchInput={handleSearch}/>
                
            {stories.isError && <p>Something went wrong ...</p>}
            {stories.isLoading ? ( <p>Loading ...</p> ) : 
                ( <List list={stories.data} /> )}
        </>
    );
};

export { Generic };