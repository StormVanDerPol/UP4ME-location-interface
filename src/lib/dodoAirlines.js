import Axios from "axios"
import { ds } from "../stored/ds"

const rootUrl = 'https://www.upforme.nl';
const apiUrl = '/api/v1';

export const methods = {
    post: 'post',
    get: 'get',
}

export const timeouts = {
    short: 1000,
    medium: 10000,
    long: 1200000,
}

export const dodoRoutes = ({
    get: {
        testAuth: rootUrl + apiUrl + '/get/restaurant/profile/to/1',
        restaurantProfile: rootUrl + apiUrl + '/get/restaurant/profile/',
        restaurantProfPic: rootUrl + apiUrl + '/get/restaurant/profpic/',
        restaurantListTo: rootUrl + apiUrl + '/get/restaurant/list/to',
    },
    post: {
        restaurant: rootUrl + apiUrl + '/set/restaurant',
    },
})

export const dodoFlight = async ({
    method = methods.get,
    url = dodoRoutes.get.testAuth,
    timeout = timeouts.short,
    data = null,
    headers = null,
    config = null,
}) => {
    try {

        const axiosParams = {
            method: method,
            url: url,
            data: data,
            timeout: timeout,
            headers: {
                authorization: ds.token,
                ...headers,
            },
            ...config,
        };

        console.log('DoDo Lift off!', axiosParams);

        return await Axios(axiosParams)
            .then((res) => {
                console.log('Landed', res);
                if (res.status === 200) {
                    if (res.headers.authorization) {
                        ds.token = res.headers.authorization;
                    }
                }

                return res;

            })
            .catch((err) => {

                console.log('Extinction...', err);

                let res = err.response;

                if (res) {

                    if (res.status === 403) {
                        ds.token = null;
                        alert('403 Forbidden - Token likely invalid');
                    } else if (res.status === 404) {
                        alert('404 API Route not found');
                    } else {
                        alert('Unhandled Error');
                    }
                } else {
                    alert('Unhandled Error - Server side / Timeout');
                }

                return null;

            })
    } catch (e) {
        console.log('Extinction...', e);
        alert('Unhandled Error');
        return null;
    }
}