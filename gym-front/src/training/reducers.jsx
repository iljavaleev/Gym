const to_add_ex = {
    count: null,
    exercise: {id: null, title: ""},
    load: [
        {reps: null, expect: null, fact: null}
    ],
    error: null
};

const to_add_set = {reps: null, expect: null, fact: null};

const trainingReducer = (state, action) => {
    switch (action.type) 
    {
        case 'TRAINING_FETCH_INIT':
            return { ...state, isLoading: true, isError: false };
        case 'TRAINING_FETCH_SUCCESS':
            return { ...state, 
                data: action.payload, 
                isLoading: false, 
                isError: false };
        case 'TRAINING_FETCH_FAILURE':
            return { ...state, isLoading: false, isError: true };
        case 'TRAINING_CRU_FAILURE':
            return { ...state, isCruError: true };
        case 'TRAINING_CRU_SUCCESS':
            return { ...state, isCruError: false, isCruSuccess: true };
        case 'EX_ADD':
            const newEl = JSON.parse(JSON.stringify(to_add_ex));
            if (state.data.length)
                newEl.count = state.data[state.data.length - 1].count + 1;
            state.data.push(newEl);
            return { 
                ...state,
                data: state.data
            };
        case 'EX_DEL':
            if (state.data.length > 0)
            {
                state.data.pop();
            }
            return { ...state };
        case 'SET_DEL':
            if (state.data[action.idx].load.length > 0)
            {
                state.data[action.idx].load.pop();
            }
            return { ...state };
        case 'SET_ADD':
            state.data[action.idx].load.push(JSON.parse(JSON.stringify(to_add_set)));
            return { ...state };
        case 'TRAINING_DEL':
            state.data.length = 0;
            return { ...state };
        default:
            throw new Error();
    }
};

export { trainingReducer };