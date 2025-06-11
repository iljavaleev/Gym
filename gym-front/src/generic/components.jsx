const List = ({ list }) => {
    let count = 0;
    return (
        <ul>
            {list.map((item) => (
                <Item key={count++} item={item}/>
            ))}
        </ul>
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