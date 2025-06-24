import { trainingData } from "./data";

const VALIDATION = {
    title: [
        {
            isValid: (value, list=trainingData) => list.includes(value),
            message: 'Выберите упражнение из списка. <a href="/my-training">Добавьте свое упражнение в список, если необходимо</a>'
        },
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
    reps: [
        {
            isValid: (value) =>/^\d+$/.test(value),
            message: 'Ошибка. Укажите числовое значение',
        },
        {
            isValid: (value) => value >= 1 && value <= 100,
            message: 'Ошибка. Значение может быть от 1 до 100',
        },
        {
            isValid: (value) => !!value,
            message: 'Поле не может быть пустым',
        },
    ],
    expect: [
        {
            isValid: (value) => value ? /^\d+$/.test(value) : true,
            message: 'Ошибка. Укажите числовое значение',
        },
        {
            isValid: (value) => value ? value >= 1 && value <= 500 : true,
            message: 'Ошибка. Значение может быть от 1 до 500',
        },
    ],
    fact: [
        {
            isValid: (value) => value ? /^\d+$/.test(value) : true,
            message: 'Ошибка. Укажите числовое значение',
        },
        {
            isValid: (value) => value ? value >= 1 && value <= 500 : true,
            message: 'Ошибка. Значение может быть от 1 до 500',
        },
    ]
};


export {VALIDATION};