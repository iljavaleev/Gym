
// if field changed

const getDirtyFields = (form, initial_state) => {
    return  (
                Object.keys(form).reduce((acc, key) => {
                    const isDirty = form[key] !== initial_state[key];
                    
                    return { ...acc, [key]: isDirty };
            }, {})
        ); 
}

const getErrorFields = (form, restrictions) =>
{
    let errors = Object.keys(form).reduce((acc, key) => {
        if (!restrictions[key]) return acc;
        
        const errorsPerField = restrictions[key]
            .map((validation) => ({
                isValid: validation.isValid(form[key]), // bool
                message: validation.message,
            }))
            .filter((errorPerField) => !errorPerField.isValid);
        return { ...acc, [key]: errorsPerField };
    }, {})
   
    if (form.hasOwnProperty('password1') && 
        form.hasOwnProperty('password2') && 
        form["password1"] !== form["password2"])
    {
        errors["password2"].push({ isValid: false, 
                message: "password1 and password2 must be same" }); 
    }

    return errors;
};

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.log(e);
        return null;
    }
};

export { getDirtyFields, getErrorFields, parseJwt };