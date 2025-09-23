import { StyledGenericList } from "./styles";
import { memo } from "react";

const List = memo(({ list }) => {
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
});

const Item = memo(({ item }) => {
    return (
    <li>
        <span>{item.exercise}</span>&nbsp;
        <span>{item.reps}</span>&nbsp;
        <span>{item?.superset}</span>&nbsp;
    </li>
)});



export { List };