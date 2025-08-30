import { trainingData } from "./data";


const VALIDATION = {
    exercise:
        {
            isValid: (value, list=trainingData) => {
                return value.title && list.some(el => el.title === value.title);
            },
            message: 'Выберите упражнение из списка или содайте свое \
            упражнение. Оно добавится в список автоматически'
        },
    reps: [
        {
            isValid: (value) => /^\d+$/.test(value),
            message: 'Ошибка. Укажите числовое значение (повторения)',
        },
        {
            isValid: (value) => value >= 1 && value <= 100,
            message: 'Ошибка. Значение может быть от 1 до 100 (повторения)',
        },
        {
            isValid: (value) => !!value,
            message: 'Поле не может быть пустым (повторения)',
        }
    ],
    expect: [
        {
            isValid: (value) => value ? /^\d+$/.test(value) : true,
            message: 'Ошибка. Укажите числовое ожидаемое значение',
        },
        {
            isValid: (value) => value ? value >= 1 && value <= 500 : true,
            message: 'Ошибка. Ожидаемое значение может быть от 1 до 500',
        }
    ],
    fact: 
    [ 
        {
            isValid: (value) => value ? /^\d+$/.test(value) : true,
            message: 'Ошибка. Укажите числовое фактическое значение',
        },
        {
            isValid: (value) => value ? value >= 1 && value <= 500 : true,
            message: 'Ошибка. Фактическое значение может быть от 1 до 500',
        },
    ]
};


export {VALIDATION};