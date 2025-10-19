import { useRef, useEffect, useContext, useState } from "react";
import { UserDataContext } from "../app/appContext";
import { trainingData } from "./data";


const Button = ({ cls, onClick, type = 'button', children, 
    disabled, style }) => (
    <button className={cls} style={style} type={type} onClick={onClick} 
        disabled={disabled}>
      {children}
    </button>
);


const InputWithLabel = ({ id, cls, value, defaultValue, type = 'text', 
    isFocused, children, onInputChange, onClick, help, ...rest }) => {
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
                onChange={onInputChange} placeholder={help} onClick={onClick} {...rest}/>
        </div>
    );
};


const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit, lbl, 
    cls, br=false }) => {
    return (
        <form onSubmit={onSearchSubmit}>
            <InputWithLabel className="search" value={searchTerm} 
                isFocused onInputChange={onSearchInput} cls={cls}>
                {lbl}
            </InputWithLabel>
            {br && <br/>}
            <button type="submit" className="submit-button" 
                disabled={!searchTerm}>
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


const AutocompleteExInput = ({ item, id, handleSuggestionClick, ref, onInputClick = null }) => {
    const userExs = useContext(UserDataContext);
    const userTrainingData = useRef(userExs.concat(trainingData));
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [ exercise, setExercise] = useState({title: item.title, id: item.id});
    
    const filtered = exercise ? userTrainingData.current.filter(suggestion => 
        {   
            const re = new RegExp(
                `(^| )(${exercise?.title?.toLowerCase().trim()})+`
            );
            return re.test(suggestion.title.toLowerCase());
        }
    ) : [];
    
    const handleChange = (event) => {
        setShowSuggestions(true);
        setExercise({ ...exercise, title: event.target.value});
    };
   
    return (
        <>
            <input className="title" type="text" placeholder="упражнение"
                ref={ref} value={exercise?.title} onChange={handleChange} 
                onClick={onInputClick ? () => onInputClick() : null} id={id}
            />
            
            {showSuggestions && (
            <ul className="scrollable-list">
                {filtered.map((suggestion, index) => (
                <li key={index} 
                    onClick={() => { 
                        handleSuggestionClick(suggestion); 
                        setShowSuggestions(false);
                        setExercise({...suggestion});
                        }}>
                    {suggestion.title}
                </li>
                ))}
            </ul>
            )}
        </>
    );
}


export { Button, InputWithLabel, SearchForm, NoMatch, Form, AutocompleteExInput };
