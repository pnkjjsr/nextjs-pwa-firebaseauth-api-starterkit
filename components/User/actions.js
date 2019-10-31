import {
    UPDATE
} from './constant'

const updateUser = (el) => {
    return {
        type: UPDATE,
        payload: el
    };
};

const fetchData = () => {}

export default {
    updateUser
};