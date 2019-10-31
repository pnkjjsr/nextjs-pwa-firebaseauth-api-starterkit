import {
    UPDATE_LOCATION,
    UPDATE_MOBILE,
    PREFETCH
} from './constant'

const initialState = {
    location: 0,
    mobile: 0
};

const account = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_LOCATION:
            return Object.assign({}, state, {
                location: 1
            });
        case UPDATE_MOBILE:
            return Object.assign({}, state, {
                mobile: 1
            });
        case PREFETCH:
            return Object.assign({}, state, {
                location: action.payload.location,
                mobile: action.payload.mobile
            });
        default:
            return state;
    }
};

export default account;