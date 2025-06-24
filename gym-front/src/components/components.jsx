import { useRef, useEffect, useState } from "react";

const Button = ({ onClick, type = 'button', children }) => (
    <button type={type} onClick={onClick}>
      {children}
    </button>
);


const InputWithLabel = ({ id, cls, value, defaultValue, type = 'text', isFocused, 
    children, onInputChange }) => {
    const inputRef = useRef();

    useEffect(() => {
        if (isFocused && inputRef.current) 
        {
            inputRef.current.focus();
        }
    }, [isFocused]);

    if (!onInputChange)
    {
        onInputChange = (event) => {
             event.target.nextElementSibling.innerHTML = "";
        }
    }
      

    return (
        <>
            <label htmlFor={id}>{children}</label>
            &nbsp;
            <input ref={inputRef} value={value} className={cls} id={id} 
                type={type} defaultValue={defaultValue} 
                onChange={onInputChange}/>
            <strong className="error" id={id + "-error"}></strong>
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


const AutocompleteInput = ({ baseData, specData, val, className, id }) => {
    const [inputValue, setInputValue] = useState(val);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const filtered = baseData.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleChange = (event) => {
        setShowSuggestions(true);
        setInputValue(event.target.value);
        event.target.nextElementSibling.innerHTML = "";
    };

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion);
        setShowSuggestions(false); 
    };

    return (
        <div >
            <input
            className={className}
            type="text"
            value={inputValue}
            onChange={handleChange}
            id={id}
            />
            <p id={id + "-error"}></p>
            {showSuggestions && (
            <ul className="suggestions-list">
                {filtered.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion}
                </li>
                ))}
            </ul>
            )}
        </div>
    );
}

export { Button, InputWithLabel, SearchForm, NoMatch, Form, AutocompleteInput };