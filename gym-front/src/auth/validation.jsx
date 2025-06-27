const VALIDATION = {
    email: [
        {
            isValid: (value) => !!value,
            message: 'Is required',
        },
        {
            isValid: (value) => /\S+@\S+\.\S+/.test(value),
            message: 'Needs to be an email',
        }
    ],
    password: [
        {
            isValid: (value) => !!value,
            message: 'Is required',
        }
    ],
    password1: [
        {
            isValid: (value) => !!value,
            message: 'Is required',
        }
    ]
};


export {VALIDATION};