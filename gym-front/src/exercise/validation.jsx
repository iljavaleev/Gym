const VALIDATION = {
    exercise: [
        {
            isValid: (value) => !!value,
            message: 'Поле не может быть пустым',
        },
        {
            isValid: (value) => value?.length >= 3,
            message: 'Поле должно содержать 3 и более символа',
        },
        {
            isValid: (value) => /^[а-яА-Я -]+$/.test(value),
            message: 'Напишите упражнение русскими буквами',
        },
    ],
};


export {VALIDATION};