import styled from 'styled-components';


const StyledCustomEx = styled.div`
    display: flex;
    gap: 0.5em;
    wrap-content: wrap;
    flex-direction: column;
    align-items: start;
    
    .create-close
    {
        background-color: #c1e15af4;
    }

    li
    {
        @media screen and (max-width: 768px) 
        {
            max-width: 20em;
        }
        
        word-wrap: break-word;
        list-style-type: decimal;
    }
    li > span
    {
        
        font-size: 1.2em;
    }    

    li > button
    {
        background-color: #e14461bf;
        padding: 0.4em 0.8em;
    }
    .comlete-button
    {
        background-color: #6ab479fe;
    }

    .exs-container
    {
        border: 2px solid #0f243382;
        border-radius: 10px;
        gap: 0.8em;
        padding: 0.8em;
        > * + * 
        {
            margin-top: 0.8em;
        }
    }

    .custom-title
    {
        > input
        {
            padding: 0.8em 0;
            min-width: 16em;
            text-align:center
        }
    }
`;

export { StyledCustomEx };