
const AuthField = ({ id, value, onChange, errorFields, children, type="text" }) => {
    return (
        <div>
            <label htmlFor={id}>{children}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
            />
            {errorFields.email?.length ? (
                <span style={{ color: 'red' }}>
                    {errorFields.email[0].message}
                </span>
            ) : null}
        </div>

    );
}

export { AuthField };