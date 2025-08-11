import { useRef, useEffect } from "react";

const Button = ({ onClick, type = 'button', children, disabled, style }) => (
    <button style={style} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
);


const InputWithLabel = ({ id, cls, value, defaultValue, type = 'text', isFocused, 
    children, onInputChange, onClick, help }) => {
    const inputRef = useRef();

    useEffect(() => {
        if (isFocused && inputRef.current) 
        {
            inputRef.current.focus();
        }
    }, [isFocused]);

    
    return (
        <>
            <label htmlFor={id} className={cls}>{children}</label>
            &nbsp;
            <input ref={inputRef} value={value} className={cls} id={id} 
                type={type} defaultValue={defaultValue} 
                onChange={onInputChange} placeholder={help} onClick={onClick}/>
        </>
    );
};


const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit, lbl, cls, br=false }) => {
    return (
        <form onSubmit={onSearchSubmit}>
            <InputWithLabel id="search" value={searchTerm} 
                isFocused onInputChange={onSearchInput} cls={cls}>
                {lbl}
            </InputWithLabel>
            {br && <br/>}
            <button type="submit" disabled={!searchTerm}>
                Поиск
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



export { Button, InputWithLabel, SearchForm, NoMatch, Form };