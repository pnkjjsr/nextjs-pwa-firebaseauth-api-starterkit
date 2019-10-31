const initialState = {
    title: "Main",
    desc: "Main page description."
};

const auth = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE":
            return Object.assign({}, state, {
                home: action.payload
            });
        default:
            return state;
    }
};

export default auth;