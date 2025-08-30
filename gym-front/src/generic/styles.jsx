import styled from 'styled-components';

const StyledGenContainer = styled.div`
    display: flex;
    gap: var(--gap-size);
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: stretch;
    

    .program-choice
    {
        flex: 1;
        
        display: flex;
        gap: 1em;
        flex-wrap: wrap;
        flex-direction: column;
        justify-content: center;
        align-items: start;


    }

    .program-search
    {   
        flex: 1;
        @media screen and (max-width: 768px) 
        {
            flex: 1 100%;
        }
    }

    .program-search-label
    {
        font-size: 1.2em;
    }
`;

const StyledSearchForm = styled.div`
    input
    {
        width: 4rem;
        padding: 0.4em;
        text-align: center;
    }
    .submit-button
    {
        background-color:  #c1e15af4;
    }
`;

const StyledButton = styled.div`
    button
    {
        color: black;
        padding: 0.6em 0.8em;
        border: none;
        border-radius: 10px; 
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }
    button:hover {
        transform: translateY(-2px); /* Slight lift on hover */
    }
`;

const StyledGenericList = styled.div`
    ul li::marker 
    {
        color: #578f6dff;
        font-size: 1.2em;
    }
`;

export { StyledGenContainer, StyledGenericList, StyledButton, 
        StyledSearchForm };
        