import styled from 'styled-components';

const StyledContainer = styled.div`
    display: flex;
    gap: var(--gap-size);
    flex-direction: column;
    
    .dateForm
    {
        flex: 1;
        
        .date-form-container
        {
            display: flex;
            gap: var(--gap-size);
            flex-direction: row;
            justify-content: center;
            align-items: start;
            
            button
            {
                background-color: #c1e15af4;
            }
        }

        #date-time-part
        {
            display: flex;
            flex-wrap:wrap;
            gap: 0.2em;
            justify-content: center;
            
            @media screen and (max-width: 768px) 
            {
                width: 10em;
            }
        }
        
    }

    .trainingForm
    {   
        flex: 1;
        .exs-list
        {
            display: flex;
            gap: var(--gap-size);
            flex-direction: row;
            flex-wrap: wrap;
            align-content: center;
            justify-content: center;
            >div
            {
                margin-block-start: 0;
            }
        }

        .input > input
        {
            width: 6rem;
            padding: 0.5em;
            text-align: center;
        }
        
        .title
        {
            width: 18rem;
            padding: 0.5em;
            text-align: center;
        }
        
        .form-button
        {
            padding: 1em;
            display: flex;
            gap: 0.3em;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            
            >button
            {
                min-width: 16em;
                background-color:  #c1e15af4;
            }
            
            
        }

    }

    .training-action
    {   
        flex: 1;
        display: flex;
        gap: 0.3em;
        flex-direction: row;
        flex-wrap: wrap;
        align-content: center;
        justify-content: center;
        
        
        >span
        {
            margin-block-start: 0;
            width: 16em;   
        }
        
        .complete-button > button
        {
            background-color: #6ab479fe;
        }
        
        .delete-button > button
        {
            background-color: #e14461bf;
        }


            
        @media screen and (max-width: 768px) 
        {   
            button
            {
                width: 16em;
            } 
        }
    }

    .exercise
    {
        button
        {
            background-color: #b4c5abae;
        }
    }
`;

export { StyledContainer };