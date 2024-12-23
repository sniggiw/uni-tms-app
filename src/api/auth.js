import { http } from "./http";

const loginByPhone = (params) => {
    return new Promise((resolve, reject) => {
        http.post("/tms-app/customer/login", params)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export { loginByPhone };