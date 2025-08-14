import { Button, SearchForm } from "../components/components";
import { useStorageState } from "../customhooks/hooks"
import { List } from "./components";
import { useReducer, useState, useEffect } from "react";
import axios from 'axios';
import styled from 'styled-components';

const StyledGenContainer = styled.div`
    display: flex;
    gap: var(--gap-size);
    flex-direction: column;
    
    .program-choice
    {
        font-weight: bold;
        flex: 1;
    }

    .program-search
    {   
        flex: 1;
    }
`;

const StyledSearchForm = styled.div`
    input
    {
        width: 5rem;
        padding: 0.5em;
        text-align: center;
    }
`;


const StyledButton = styled.div`
    button
    {
        background-color: #fdfdfdec;
        color: black;
        padding: 0.8em 1.2em;
        border: none;
        border-radius: 10px; 
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }
    button:hover {
        transform: translateY(-2px); /* Slight lift on hover */
    }
`;

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
        <StyledGenContainer>
            <div className="program-choice area">
                <div>
                    <span className="program-search-label">Выберите программу:</span><br/>
                    &nbsp;
                    <StyledButton>
                        <Button  style={{ backgroundColor: !bookTerm ? "#578f6db4" : "#fffefef8"}} onClick={() => setBookTerm(0)} >Пауэрлифтинг</Button>
                        <Button  style={{ backgroundColor: bookTerm ? "#578f6dbb" : "#fffefef8"}} onClick={() => setBookTerm(1)} >Похудайка</Button>
                    </StyledButton>
                </div>
        
                <StyledSearchForm>
                    <SearchForm searchTerm={searchNumberTerm} 
                                onSearchSubmit={handleSearchSubmit} 
                                onSearchInput={handleSearch}
                                lbl="Введите номер тренировки:"
                                cls="program-search-label"
                                br={true}/>
                </StyledSearchForm>
                
            </div>
            <div className="program-search area">
                {stories.isError && <p>Something went wrong ...</p>}
                {stories.isLoading ? ( <p>Loading ...</p> ) : 
                    ( <List list={stories.data} /> )}
            </div>
        </StyledGenContainer>
    );
};

export { Generic };