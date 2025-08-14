import styled from 'styled-components';

const StyledGenericList = styled.div`
    ul li::marker 
    {
        color: #578f6dff;
        font-size: 1.2em;
    }
`;


const List = ({ list }) => {
    let count = 0;
    return (
        <StyledGenericList>
        <ul>
            {list.map((item) => (
                <Item key={count++} item={item}/>
            ))}
        </ul>
        </StyledGenericList>
    );
};

const Item = ({ item }) => (
    <li>
        <span>{item.exercise}</span>&nbsp;
        <span>{item.reps}</span>&nbsp;
        <span>{item?.superset}</span>&nbsp;
    </li>
);



export { List };