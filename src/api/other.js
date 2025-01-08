import {
    http
} from "./http";

const getCity = (params) => {
    return new Promise((resolve, reject) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `/tms-app/common/list-area?${queryString}`;
        http.get(url)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};


const getCustomerInfo = () => {
    return new Promise((resolve, reject) => {
        http.get("/tms-app/customer/info")
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export {
    getCity,
    getCustomerInfo
};