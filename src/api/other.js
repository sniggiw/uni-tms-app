import { http } from "./http";

const getCity = () => {
    return new Promise((resolve, reject) => {
        http.get("/tms-app/common/list-area")
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

export { getCity, getCustomerInfo };
