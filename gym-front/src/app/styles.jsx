import styled from 'styled-components';

const StyledContainer = styled.div`
    max-inline-size: 1080px;
    margin-inline: auto;
`;

const StyledNavMobile = styled.nav`
    display: none; 
    @media screen and (max-width: 768px) 
    {
        display: block;
    }
`;


const StyledNavDesk = styled.nav`
    @media screen and (max-width: 768px) 
    {
        display: none;
    }
`;


const StyledMenu = styled.ul`
   
    @media screen and (max-width: 768px) 
    {
        position: fixed;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2); 
        z-index: 1000; 
    }

    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    gap: 0.5em;
    padding: 0.5rem;
    background-color: #b3e778c9;
    border-radius: 15px;
    border: 3px solid #80bd3b91;
    
    li 
    {
      list-style-type: none;
    }

    li > a 
    {
      flex: 1;

      display: block;
      background-color: #578f6dff;
      color: white;
      padding: 0.5em 1em;
      text-decoration: none;
      border-radius: 20px;
      color: #f0eeeeff;
      font-size: 18px;
    };

`;


const StyledChiled = styled.div`
    .area
    {   
        border-radius: 20px;
        background-color: #b3e77891;
        padding: 1.5em;
        border: 3px solid #80bd3b91;
       
    }

    input
    {
        border: 1px solid #b3e77891;
        border-radius: 10px;
        color: #333;
        background-color: #f1ebebec;
        cursor: pointer;
        transition: border-color 0.3s ease;
    }

    input:focus 
    {
        border-color: #007bff;
        outline: none;
    }

    button
    {
        background-color: #f1ebebec;
        color: black;
        padding: 0.8em 1.2em;
        border: none;
        border-radius: 10px; 
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    button:hover {
        transform: translateY(-2px);
    }
`;


export { StyledChiled, StyledMenu, StyledContainer, StyledNavMobile, StyledNavDesk };