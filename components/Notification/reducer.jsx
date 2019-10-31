import {
    SHOW, HIDE
} from './constant'

const initialState = {
    show: "hide",
    message: ""
};

const notification = (state = initialState, action) => {
    switch (action.type) {
        case SHOW:
            return Object.assign({}, state, {
                show: "show",
                message: action.payload.message
            });
        case HIDE:
            return Object.assign({}, state, {
                show: "hide",
                message: ""
            });
        default:
            return state;
    }
};

export default notification;