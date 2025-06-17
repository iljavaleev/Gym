import { useRef, useEffect } from "react";

const Button = ({ onClick, type = 'button', children }) => (
    <button type={type} onClick={onClick}>
      {children}
    </button>
);

const InputWithLabel = ({ id, value, type = 'text', onInputChange, isFocused, 
    children }) => {
    const inputRef = useRef();

    useEffect(() => {
        if (isFocused && inputRef.current) 
        {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input ref={inputRef} id={id} type={type} value={value} 
                onChange={onInputChange}/>
        </>
    );
};


const InputWithLabelD = ({ id, cls, defaultValue, type = 'text', isFocused, 
    children, onInputChange }) => {
    const inputRef = useRef();

    useEffect(() => {
        if (isFocused && inputRef.current) 
        {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input ref={inputRef} className={cls} id={id} type={type} defaultValue={defaultValue} onChange={onInputChange}/>
        </>
    );
};


const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => {
    return (
        <form onSubmit={onSearchSubmit}>
            <InputWithLabel id="search" value={searchTerm} 
                isFocused onInputChange={onSearchInput}>
                <strong>Search:</strong>
            </InputWithLabel>
            <button type="submit" disabled={!searchTerm}>
                Submit
            </button>
        </form>
    );
};


const Form = ({ onSubmit, children }) => (
    <form onSubmit={onSubmit}>{children}</form>
);


const NoMatch = () => {
    return (<p>There's nothing here: 404!</p>);
};

const DateTimeForm = ({ onSubmit, onChange, type="datetime-local" }) => {
    
    return (
            <form onSubmit={onSubmit}>
                <InputWithLabelD id="training-time" defaultValue={ Date.now() } onInputChange={onChange} 
                    type={type} isFocused>
                    <strong>Найти тренировку: </strong>
                </InputWithLabelD>
                <button type="submit">Поиск</button>
            </form>
    );
}



export { Button, InputWithLabel, SearchForm, NoMatch, Form, DateTimeForm, InputWithLabelD };