const VALIDATION = {
    email: [
        {
            isValid: (value) => !!value,
            message: 'Поле не может быть пустым',
        },
        {
            isValid: (value) => /\S+@\S+\.\S+/.test(value),
            message: 'Необходим электронный адрес',
        }
    ],
    password: [
        {
            isValid: (value) => !!value,
            message: 'Поле не может быть пустым',
        }
    ],
    password1: [
        {
            isValid: (value) => !!value,
            message: 'Поле не может быть пустым',
        }
    ]
};


export {VALIDATION};