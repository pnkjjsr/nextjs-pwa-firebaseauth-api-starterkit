import {
    UPDATE_LOCATION,
    UPDATE_MOBILE,
    PREFETCH
} from './constant'

import {
    service
} from "../../utils/service"
import authSession from "../../components/utils/authSession"

const prefetchData = () => {
    return function (dispatch) {
        let e;
        const session = new authSession();
        const token = session.getToken();
        let data = {
            uid: token
        }
        return service.post("/getLocation", data)
            .then((res) => {
                e = res.data;
                if (e.pincode && !e.phoneNumber) {
                    let data = {
                        location: 1,
                        mobile: 0
                    };
                    dispatch({
                        type: PREFETCH,
                        payload: data
                    })
                } else if (!e.pincode && e.phoneNumber) {
                    let data = {
                        location: 0,
                        mobile: 1
                    };
                    dispatch({
                        type: PREFETCH,
                        payload: data
                    })
                } else if (e.pincode && e.phoneNumber) {
                    let data = {
                        location: 1,
                        mobile: 1
                    };
                    dispatch({
                        type: PREFETCH,
                        payload: data
                    })
                }

            })
            .catch((error) => {
                console.log(error);
            })
    }
}

const update_location = () => {
    return {
        type: UPDATE_LOCATION
    };
};
const update_mobile = () => {
    return {
        type: UPDATE_MOBILE
    };
};

export default {
    prefetchData,
    update_location,
    update_mobile
};