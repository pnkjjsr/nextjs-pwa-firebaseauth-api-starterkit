import {
    UPDATE
} from './constant'

const initialState = {
    name: "",
    eVerified: "",
    email: "",
    mobile: "",
    photo: "",
    uid: "",
    token: ""
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE:
            return Object.assign({}, state, {
                name: action.payload.name,
                eVerified: action.payload.eVerified,
                email: action.payload.email,
                mobile: action.payload.mobile,
                photo: action.payload.photo,
                uid: action.payload.uid,
                token: action.payload.token
            });
        default:
            return state;
    }
};

export default user;