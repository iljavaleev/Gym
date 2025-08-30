import styled from 'styled-components';

const StyledForm = styled.form`
    display: flex;
    gap: var(--gap-size);
    flex-direction: column;
    flex-wrap: wrap;
    align-items: start;
    .to-register
    {
       
        font-size: 0.8em;
    }
    button
    {
        background-color: #eaf133c9;
    }
    
`;

export { StyledForm };