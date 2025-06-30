
const AuthField = ({ id, value, onChange,children, type="text" }) => {
    return (
        <div>
            <label htmlFor={id}>{children}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
            />
        </div>

    );
}

export { AuthField };