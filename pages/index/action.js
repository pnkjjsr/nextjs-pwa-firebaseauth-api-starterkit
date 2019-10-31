import {
    GET_VERIFICATION,
    GET_REGISTRATION,
    GET_HOME
} from "./constant"

import authSession from "../../components/utils/authSession"
import {
    service
} from '../../utils';

const get_verification = function () {
    const session = new authSession();
    const token = session.getToken();
    if (token) {
        const data = {
            uid: token
        }
        return function (dispatch) {
            return service.post("/user", data)
                .then(res => {
                    let emailVerified = res.data.user.emailVerified

                    if (!emailVerified) {
                        dispatch({
                            type: GET_VERIFICATION
                        })
                    } else {
                        dispatch({
                            type: GET_HOME
                        })
                    }
                })
                .catch(error => {
                    let data = error.response.data;
                    let msg = data[Object.keys(data)[0]]
                    let obj = {
                        message: msg
                    }
                    console.log(obj);
                })

        }


    } else {
        return {
            type: GET_REGISTRATION
        };
    }
};

const get_registration = function () {
    return {
        type: GET_REGISTRATION
    };
};

const get_home = function () {
    return {
        type: GET_HOME
    };
};

export default {
    get_verification,
    get_registration,
    get_home
};