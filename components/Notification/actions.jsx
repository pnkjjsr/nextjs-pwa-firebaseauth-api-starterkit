import { SHOW, HIDE } from './constant'

const showNotification = (e) => {
    return {
        type: SHOW,
        payload: e
    };
};

const hideNotification = () => {
    return {
        type: HIDE
    };
};

export default {
    showNotification,
    hideNotification
};