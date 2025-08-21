import { useRef, useEffect } from "react";

const Button = ({ cls, onClick, type = 'button', children, disabled, style }) => (
    <button className={cls} style={style} type={type} onClick={onClick} disabled={disabled}>
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
        <div  className={cls}>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input ref={inputRef} value={value} id={id} 
                type={type} defaultValue={defaultValue} 
                onChange={onInputChange} placeholder={help} onClick={onClick}/>
        </div>
    );
};


const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit, lbl, cls, br=false }) => {
    return (
        <form onSubmit={onSearchSubmit}>
            <InputWithLabel className="search" value={searchTerm} 
                isFocused onInputChange={onSearchInput} cls={cls}>
                {lbl}
            </InputWithLabel>
            {br && <br/>}
            <button type="submit" className="submit-button" disabled={!searchTerm}>
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