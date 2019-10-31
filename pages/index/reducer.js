import {
    GET_VERIFICATION,
    GET_REGISTRATION,
    GET_HOME
} from "./constant"

const initialState = {
    view: 2
};

const home = (state = initialState, action) => {
    switch (action.type) {
        case GET_REGISTRATION:
            return Object.assign({}, state, {
                view: 0
            });
        case GET_VERIFICATION:
            return Object.assign({}, state, {
                view: 1
            });
        case GET_HOME:
            return Object.assign({}, state, {
                view: 2
            });
        default:
            return state;
    }
};

export default home;