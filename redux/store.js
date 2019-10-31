import {
    createStore,
    applyMiddleware
} from "redux";
import {
    composeWithDevTools
} from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./reducer";

export const initStore = (initialState, options) => {
    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(thunkMiddleware))
    );
};